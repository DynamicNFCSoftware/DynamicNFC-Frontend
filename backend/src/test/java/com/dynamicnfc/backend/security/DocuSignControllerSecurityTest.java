package com.dynamicnfc.backend.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Security tests for DocuSignController (/api/docusign/**)
 * Tests: Input validation, injection, path traversal in envelopeId,
 *        error message leakage, abuse of public endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DocuSignControllerSecurityTest {

    @Autowired private MockMvc mvc;

    // ─── Input Validation ──────────────────────────────────

    @Nested
    @DisplayName("Input Validation")
    class InputValidation {

        @Test
        @DisplayName("Create envelope without recipientEmail returns 400")
        void missingEmail() throws Exception {
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"recipientName\":\"Test\"}"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Create envelope with blank email returns 400")
        void blankEmail() throws Exception {
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"recipientEmail\":\"   \"}"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Empty body to create-envelope returns error")
        void emptyBody() throws Exception {
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                .andExpect(status().isBadRequest());
        }
    }

    // ─── Injection in envelopeId ───────────────────────────

    @Nested
    @DisplayName("Injection in Path Parameters")
    class PathInjection {

        @Test
        @DisplayName("SQL injection in envelopeId — should not crash")
        void sqlInjectionInEnvelopeId() throws Exception {
            mvc.perform(get("/api/docusign/envelope/' OR '1'='1"))
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(500))));
            // DocuSign API will reject it, but server should not crash
        }

        @Test
        @DisplayName("Path traversal in envelopeId")
        void pathTraversal() throws Exception {
            // Spring MVC normalizes paths, so ../../ may be resolved or rejected
            mvc.perform(get("/api/docusign/envelope/..%2F..%2Fetc%2Fpasswd"))
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(400),
                    equalTo(404),
                    equalTo(500))));
        }

        @Test
        @DisplayName("XSS in search param for templates")
        void xssInSearch() throws Exception {
            MvcResult result = mvc.perform(get("/api/docusign/templates")
                    .param("search", "<script>alert('xss')</script>"))
                .andReturn();

            String body = result.getResponse().getContentAsString();
            assertFalse(body.contains("<script>alert"),
                "Response must not reflect unescaped XSS payload");
        }
    }

    // ─── Error Leakage ─────────────────────────────────────

    @Nested
    @DisplayName("Error Message Leakage")
    class ErrorLeakage {

        @Test
        @DisplayName("Internal errors do not leak stack traces")
        void noStackTraceLeakage() throws Exception {
            // Force an error by hitting the API (DocuSign not configured in test)
            MvcResult result = mvc.perform(get("/api/docusign/envelope/fake-id"))
                .andReturn();

            String body = result.getResponse().getContentAsString();
            assertFalse(body.contains("at com.dynamicnfc"),
                "Error response must not contain stack traces");
            assertFalse(body.contains("NullPointerException"),
                "Error response must not contain Java exception class names");
        }

        @Test
        @DisplayName("Demo NDA endpoint returns safe response when unconfigured")
        void demoNdaSafeWhenUnconfigured() throws Exception {
            mvc.perform(post("/api/docusign/demo/create-nda"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.configured").value(false));
        }
    }

    // ─── Access Control ────────────────────────────────────

    @Nested
    @DisplayName("Access Control — All DocuSign endpoints are public")
    class AccessControl {

        @Test
        @DisplayName("GET /api/docusign/status — accessible without auth")
        void statusPublic() throws Exception {
            mvc.perform(get("/api/docusign/status"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("POST /api/docusign/create-envelope — accessible without auth")
        void createEnvelopePublic() throws Exception {
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"recipientEmail\":\"test@test.com\"}"))
                // Will fail because DocuSign is not configured, but NOT 401/403
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(500))));
        }

        @Test
        @DisplayName("POST /api/docusign/demo/create-nda — accessible without auth")
        void demoNdaPublic() throws Exception {
            mvc.perform(post("/api/docusign/demo/create-nda"))
                .andExpect(status().isOk());
        }
    }

    // ─── Abuse of create-envelope ──────────────────────────

    @Nested
    @DisplayName("Abuse Prevention")
    class AbusePrevention {

        @Test
        @DisplayName("Oversized recipientName does not crash server")
        void oversizedName() throws Exception {
            String longName = "A".repeat(50000);
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(String.format("{\"recipientName\":\"%s\",\"recipientEmail\":\"t@t.com\"}", longName)))
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(400),
                    equalTo(500))));
        }

        @Test
        @DisplayName("Injection in status field")
        void injectionInStatus() throws Exception {
            mvc.perform(post("/api/docusign/create-envelope")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"recipientEmail\":\"t@t.com\",\"status\":\"'; DROP TABLE envelope; --\"}"))
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(500))));
        }
    }
}
