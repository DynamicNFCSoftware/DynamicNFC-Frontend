package com.dynamicnfc.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
public class DocuSignService {

    private static final Logger log = LoggerFactory.getLogger(DocuSignService.class);
    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate rest = new RestTemplate();

    @Value("${docusign.integration-key:}")
    private String integrationKey;

    @Value("${docusign.user-id:}")
    private String userId;

    @Value("${docusign.account-id:}")
    private String accountId;

    @Value("${docusign.rsa-key-path:}")
    private String rsaKeyPath;

    @Value("${docusign.base-uri:https://ca.docusign.net}")
    private String baseUri;

    @Value("${docusign.auth-server:account.docusign.com}")
    private String authServer;

    private String cachedAccessToken;
    private Instant tokenExpiry = Instant.MIN;

    /**
     * Check if DocuSign is configured with required credentials.
     */
    public boolean isConfigured() {
        return integrationKey != null && !integrationKey.isBlank()
                && userId != null && !userId.isBlank()
                && rsaKeyPath != null && !rsaKeyPath.isBlank();
    }

    /**
     * Get an access token using JWT Grant flow.
     */
    public String getAccessToken() throws Exception {
        if (cachedAccessToken != null && Instant.now().isBefore(tokenExpiry)) {
            return cachedAccessToken;
        }

        // Build JWT
        String header = base64Url(mapper.writeValueAsString(Map.of("typ", "JWT", "alg", "RS256")));

        long now = Instant.now().getEpochSecond();
        String payload = base64Url(mapper.writeValueAsString(Map.of(
                "iss", integrationKey,
                "sub", userId,
                "aud", authServer,
                "iat", now,
                "exp", now + 3600,
                "scope", "signature impersonation"
        )));

        String signingInput = header + "." + payload;
        RSAPrivateKey privateKey = loadPrivateKey();

        java.security.Signature sig = java.security.Signature.getInstance("SHA256withRSA");
        sig.initSign(privateKey);
        sig.update(signingInput.getBytes(StandardCharsets.UTF_8));
        String signature = Base64.getUrlEncoder().withoutPadding().encodeToString(sig.sign());

        String jwt = signingInput + "." + signature;

        // Exchange JWT for access token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + jwt;
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<JsonNode> response = rest.postForEntity(
                "https://" + authServer + "/oauth/token",
                request,
                JsonNode.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            cachedAccessToken = response.getBody().get("access_token").asText();
            int expiresIn = response.getBody().get("expires_in").asInt(3600);
            tokenExpiry = Instant.now().plusSeconds(expiresIn - 60);
            log.info("DocuSign access token obtained, expires in {}s", expiresIn);
            return cachedAccessToken;
        }

        throw new RuntimeException("Failed to get DocuSign access token: " + response.getStatusCode());
    }

    /**
     * Get user info from DocuSign.
     */
    public JsonNode getUserInfo() throws Exception {
        String token = getAccessToken();
        HttpHeaders headers = authHeaders(token);
        ResponseEntity<JsonNode> resp = rest.exchange(
                "https://" + authServer + "/oauth/userinfo",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                JsonNode.class
        );
        return resp.getBody();
    }

    /**
     * List templates in the account.
     */
    public JsonNode getTemplates(String searchText) throws Exception {
        String token = getAccessToken();
        HttpHeaders headers = authHeaders(token);
        String url = baseUri + "/restapi/v2.1/accounts/" + accountId + "/templates";
        if (searchText != null && !searchText.isBlank()) {
            url += "?search_text=" + java.net.URLEncoder.encode(searchText, StandardCharsets.UTF_8);
        }
        ResponseEntity<JsonNode> resp = rest.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
        return resp.getBody();
    }

    /**
     * Create an envelope (NDA) and send it to a recipient.
     *
     * @param recipientName  e.g. "Khalid Al-Rashid"
     * @param recipientEmail e.g. "khalid.alrashid@vista.ae"
     * @param templateId     optional — if null, creates inline document
     * @param status         "created" (draft) or "sent"
     * @return envelope info with envelopeId, status, etc.
     */
    public JsonNode createEnvelope(String recipientName, String recipientEmail,
                                    String templateId, String status) throws Exception {
        String token = getAccessToken();
        HttpHeaders headers = authHeaders(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectNode envelope = mapper.createObjectNode();
        envelope.put("emailSubject", "VIP Buyer NDA — Al Noor Residences — " + recipientName);
        envelope.put("status", status != null ? status : "created");

        if (templateId != null && !templateId.isBlank()) {
            // Use existing template
            envelope.put("templateId", templateId);

            ObjectNode templateRole = mapper.createObjectNode();
            templateRole.put("name", recipientName);
            templateRole.put("email", recipientEmail);
            templateRole.put("roleName", "Signer");

            ArrayNode roles = mapper.createArrayNode();
            roles.add(templateRole);
            envelope.set("templateRoles", roles);
        } else {
            // Create inline document (simple NDA)
            String ndaHtml = buildNdaHtml(recipientName);
            String docBase64 = Base64.getEncoder().encodeToString(ndaHtml.getBytes(StandardCharsets.UTF_8));

            ObjectNode document = mapper.createObjectNode();
            document.put("documentBase64", docBase64);
            document.put("name", "VIP Buyer NDA — Al Noor Residences");
            document.put("fileExtension", "html");
            document.put("documentId", "1");

            ArrayNode documents = mapper.createArrayNode();
            documents.add(document);
            envelope.set("documents", documents);

            // Signer
            ObjectNode signer = mapper.createObjectNode();
            signer.put("name", recipientName);
            signer.put("email", recipientEmail);
            signer.put("recipientId", "1");
            signer.put("routingOrder", "1");

            // Sign here tab
            ObjectNode signTab = mapper.createObjectNode();
            signTab.put("anchorString", "/sig1/");
            signTab.put("anchorUnits", "pixels");
            signTab.put("anchorXOffset", "20");
            signTab.put("anchorYOffset", "10");

            ObjectNode dateTab = mapper.createObjectNode();
            dateTab.put("anchorString", "/date1/");
            dateTab.put("anchorUnits", "pixels");
            dateTab.put("anchorXOffset", "20");
            dateTab.put("anchorYOffset", "10");

            ObjectNode tabs = mapper.createObjectNode();
            ArrayNode signHereTabs = mapper.createArrayNode();
            signHereTabs.add(signTab);
            tabs.set("signHereTabs", signHereTabs);

            ArrayNode dateSignedTabs = mapper.createArrayNode();
            dateSignedTabs.add(dateTab);
            tabs.set("dateSignedTabs", dateSignedTabs);

            signer.set("tabs", tabs);

            ObjectNode recipients = mapper.createObjectNode();
            ArrayNode signers = mapper.createArrayNode();
            signers.add(signer);
            recipients.set("signers", signers);
            envelope.set("recipients", recipients);
        }

        String url = baseUri + "/restapi/v2.1/accounts/" + accountId + "/envelopes";
        HttpEntity<String> request = new HttpEntity<>(mapper.writeValueAsString(envelope), headers);

        ResponseEntity<JsonNode> resp = rest.postForEntity(url, request, JsonNode.class);
        log.info("DocuSign envelope created: {}", resp.getBody());
        return resp.getBody();
    }

    /**
     * Get envelope status by ID.
     */
    public JsonNode getEnvelope(String envelopeId) throws Exception {
        String token = getAccessToken();
        HttpHeaders headers = authHeaders(token);
        String url = baseUri + "/restapi/v2.1/accounts/" + accountId + "/envelopes/" + envelopeId;
        ResponseEntity<JsonNode> resp = rest.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
        return resp.getBody();
    }

    /**
     * List recent envelopes.
     */
    public JsonNode listEnvelopes(String fromDate) throws Exception {
        String token = getAccessToken();
        HttpHeaders headers = authHeaders(token);
        String url = baseUri + "/restapi/v2.1/accounts/" + accountId + "/envelopes?from_date=" +
                java.net.URLEncoder.encode(fromDate, StandardCharsets.UTF_8);
        ResponseEntity<JsonNode> resp = rest.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
        return resp.getBody();
    }

    // ── Private helpers ──

    private String buildNdaHtml(String recipientName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Georgia', serif; color: #1a1a1f; padding: 60px; max-width: 800px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #C5A467; padding-bottom: 30px; margin-bottom: 40px; }
                        .logo { font-size: 14px; letter-spacing: 3px; color: #C5A467; text-transform: uppercase; margin-bottom: 8px; }
                        h1 { font-size: 28px; font-weight: normal; margin: 0; color: #1a1a1f; }
                        .subtitle { font-size: 14px; color: #666; margin-top: 8px; }
                        .section { margin-bottom: 24px; }
                        .section h3 { font-size: 16px; color: #C5A467; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
                        .section p { font-size: 14px; line-height: 1.8; color: #333; }
                        .parties { display: flex; justify-content: space-between; margin: 30px 0; padding: 20px; background: #faf8f5; border: 1px solid #e0d5c0; }
                        .party { flex: 1; }
                        .party h4 { font-size: 13px; color: #C5A467; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
                        .party p { font-size: 14px; color: #1a1a1f; }
                        .sig-block { margin-top: 60px; display: flex; justify-content: space-between; }
                        .sig-line { flex: 1; margin: 0 20px; }
                        .sig-line .label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
                        .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e0d5c0; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">DynamicNFC</div>
                        <h1>Non-Disclosure Agreement</h1>
                        <div class="subtitle">Al Noor Residences — VIP Buyer Access</div>
                    </div>

                    <div class="parties">
                        <div class="party">
                            <h4>Disclosing Party</h4>
                            <p>DynamicNFC Inc.<br/>1079 Canyon Blvd<br/>North Vancouver, V7R 2K5<br/>BC, Canada</p>
                        </div>
                        <div class="party">
                            <h4>Receiving Party</h4>
                            <p>%s<br/>VIP Access Key Holder</p>
                        </div>
                    </div>

                    <div class="section">
                        <h3>1. Confidential Information</h3>
                        <p>The Receiving Party agrees that all information disclosed regarding Al Noor Residences, including but not limited to pre-launch pricing, unit availability, floor plans, investment projections, and exclusive VIP terms, shall be treated as strictly confidential.</p>
                    </div>

                    <div class="section">
                        <h3>2. Obligations</h3>
                        <p>The Receiving Party shall not disclose, publish, or disseminate Confidential Information to any third party without prior written consent. This obligation extends to all pre-launch pricing, exclusive offers, and investment terms provided through the VIP Access Key program.</p>
                    </div>

                    <div class="section">
                        <h3>3. Duration</h3>
                        <p>This Agreement shall remain in effect for a period of two (2) years from the date of execution, or until the information becomes publicly available through no fault of the Receiving Party.</p>
                    </div>

                    <div class="section">
                        <h3>4. VIP Access Benefits</h3>
                        <p>Upon execution of this NDA, the Receiving Party shall receive access to exclusive pre-launch pricing for Al Noor Residences, including Unit PH-4201 (Sky Penthouse). Priority viewing appointments and dedicated concierge service will be activated immediately.</p>
                    </div>

                    <div class="sig-block">
                        <div class="sig-line">
                            <div class="label">Signature</div>
                            <div>/sig1/</div>
                        </div>
                        <div class="sig-line">
                            <div class="label">Date</div>
                            <div>/date1/</div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>DynamicNFC Inc. — 1079 Canyon Blvd, North Vancouver V7R 2K5, BC, Canada<br/>
                        info@dynamicnfc.help | +1 672 200 8071 | dynamicnfc.ca</p>
                    </div>
                </body>
                </html>
                """.formatted(recipientName);
    }

    private HttpHeaders authHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    private String base64Url(String data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data.getBytes(StandardCharsets.UTF_8));
    }

    private RSAPrivateKey loadPrivateKey() throws Exception {
        String pem = Files.readString(Path.of(rsaKeyPath));
        boolean isPkcs1 = pem.contains("BEGIN RSA PRIVATE KEY");

        pem = pem.replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] keyBytes = Base64.getDecoder().decode(pem);

        if (isPkcs1) {
            // Convert PKCS#1 to PKCS#8 by wrapping with ASN.1 header
            byte[] pkcs8Header = {
                    0x30, (byte) 0x82, 0, 0, // SEQUENCE (length placeholder)
                    0x02, 0x01, 0x00,         // INTEGER 0 (version)
                    0x30, 0x0d,               // SEQUENCE
                    0x06, 0x09,               // OID
                    0x2a, (byte) 0x86, 0x48, (byte) 0x86, (byte) 0xf7, 0x0d, 0x01, 0x01, 0x01, // rsaEncryption
                    0x05, 0x00,               // NULL
                    0x04, (byte) 0x82, 0, 0   // OCTET STRING (length placeholder)
            };
            byte[] pkcs8 = new byte[pkcs8Header.length + keyBytes.length];
            System.arraycopy(pkcs8Header, 0, pkcs8, 0, pkcs8Header.length);
            System.arraycopy(keyBytes, 0, pkcs8, pkcs8Header.length, keyBytes.length);

            // Fix lengths
            int totalLen = pkcs8.length - 4;
            pkcs8[2] = (byte) (totalLen >> 8);
            pkcs8[3] = (byte) (totalLen & 0xff);
            int octetLen = keyBytes.length;
            pkcs8[pkcs8Header.length - 2] = (byte) (octetLen >> 8);
            pkcs8[pkcs8Header.length - 1] = (byte) (octetLen & 0xff);

            keyBytes = pkcs8;
        }

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
    }
}
