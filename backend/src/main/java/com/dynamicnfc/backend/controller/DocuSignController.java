package com.dynamicnfc.backend.controller;

import com.dynamicnfc.backend.service.DocuSignService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/docusign")
public class DocuSignController {

    private static final Logger log = LoggerFactory.getLogger(DocuSignController.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private DocuSignService docuSignService;

    /**
     * Health check — is DocuSign configured?
     */
    @GetMapping("/status")
    public ResponseEntity<?> status() {
        boolean configured = docuSignService.isConfigured();
        return ResponseEntity.ok(Map.of(
                "configured", configured,
                "message", configured ? "DocuSign is ready" : "DocuSign credentials not configured"
        ));
    }

    /**
     * Get DocuSign user info (tests authentication).
     */
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo() {
        try {
            JsonNode info = docuSignService.getUserInfo();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            log.error("DocuSign getUserInfo failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * List templates, optionally filtered by search text.
     */
    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates(@RequestParam(required = false) String search) {
        try {
            JsonNode templates = docuSignService.getTemplates(search);
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            log.error("DocuSign getTemplates failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Create an NDA envelope for a VIP prospect.
     * Body: { "recipientName": "Khalid Al-Rashid", "recipientEmail": "khalid@...", "templateId": "optional", "status": "created|sent" }
     */
    @PostMapping("/create-envelope")
    public ResponseEntity<?> createEnvelope(@RequestBody Map<String, String> body) {
        try {
            String name = body.getOrDefault("recipientName", "VIP Prospect");
            String email = body.get("recipientEmail");
            String templateId = body.get("templateId");
            String status = body.getOrDefault("status", "created");

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "recipientEmail is required"));
            }

            JsonNode result = docuSignService.createEnvelope(name, email, templateId, status);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("DocuSign createEnvelope failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get envelope status by ID.
     */
    @GetMapping("/envelope/{envelopeId}")
    public ResponseEntity<?> getEnvelope(@PathVariable String envelopeId) {
        try {
            JsonNode envelope = docuSignService.getEnvelope(envelopeId);
            return ResponseEntity.ok(envelope);
        } catch (Exception e) {
            log.error("DocuSign getEnvelope failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * List recent envelopes (last 30 days).
     */
    @GetMapping("/envelopes")
    public ResponseEntity<?> listEnvelopes() {
        try {
            String fromDate = java.time.ZonedDateTime.now()
                    .minusDays(30)
                    .format(java.time.format.DateTimeFormatter.ISO_INSTANT);
            JsonNode envelopes = docuSignService.listEnvelopes(fromDate);
            return ResponseEntity.ok(envelopes);
        } catch (Exception e) {
            log.error("DocuSign listEnvelopes failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Demo endpoint — creates an NDA for Khalid Al-Rashid (draft, not sent).
     * Used by the AI Demo frontend to get a real envelope ID.
     */
    @PostMapping("/demo/create-nda")
    public ResponseEntity<?> createDemoNda() {
        try {
            if (!docuSignService.isConfigured()) {
                // Return mock data if not configured
                ObjectNode mock = mapper.createObjectNode();
                mock.put("envelopeId", "demo-not-configured");
                mock.put("status", "demo");
                mock.put("message", "DocuSign not configured — set credentials in application.properties");
                mock.put("configured", false);
                return ResponseEntity.ok(mock);
            }

            JsonNode result = docuSignService.createEnvelope(
                    "Khalid Al-Rashid",
                    "khalid.alrashid@vista.ae",
                    null,
                    "created"  // Draft — not actually sent
            );

            ObjectNode response = mapper.createObjectNode();
            response.put("configured", true);
            response.put("envelopeId", result.has("envelopeId") ? result.get("envelopeId").asText() : "");
            response.put("status", result.has("status") ? result.get("status").asText() : "created");
            response.put("uri", result.has("uri") ? result.get("uri").asText() : "");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("DocuSign demo NDA failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
