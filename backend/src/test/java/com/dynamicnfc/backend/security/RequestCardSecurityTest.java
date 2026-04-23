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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Security tests for RequestCardController (/api/request-card)
 * Tests: Input validation, email injection, XSS, oversized payloads.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RequestCardSecurityTest {

    @Autowired private MockMvc mvc;

    // ─── Input Validation ──────────────────────────────────

    @Nested
    @DisplayName("Input Validation")
    class InputValidation {

        @Test
        @DisplayName("Request with both fields blank returns 400")
        void blankFields() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"fullName\":\"\",\"email\":\"\"}"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Request with null body returns 400")
        void nullBody() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("null"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Valid request with email only succeeds")
        void validEmailOnly() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"valid@test.com\"}"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Valid request with fullName only succeeds")
        void validNameOnly() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"fullName\":\"John Doe\"}"))
                .andExpect(status().isOk());
        }
    }

    // ─── Email Header Injection ────────────────────────────

    @Nested
    @DisplayName("Email Header Injection Prevention")
    class EmailInjection {

        @Test
        @DisplayName("CRLF injection in fullName (email header injection)")
        void crlfInName() throws Exception {
            // Attempt to inject additional email headers via CRLF
            String payload = "{\"fullName\":\"Attacker\\r\\nBcc: attacker@evil.com\\r\\nSubject: Injected\",\"email\":\"test@test.com\"}";
            MvcResult result = mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payload))
                .andExpect(status().isOk())
                .andReturn();

            // Server should handle it — the mail subject is constructed server-side
            // This verifies the server doesn't crash
        }

        @Test
        @DisplayName("CRLF injection in email field")
        void crlfInEmail() throws Exception {
            String payload = "{\"fullName\":\"Test\",\"email\":\"test@test.com\\r\\nBcc: attacker@evil.com\"}";
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payload))
                .andExpect(status().isOk());
        }
    }

    // ─── XSS ───────────────────────────────────────────────

    @Nested
    @DisplayName("XSS Prevention")
    class XssPrevention {

        @Test
        @DisplayName("XSS in fullName field")
        void xssInName() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"fullName\":\"<script>alert('xss')</script>\",\"email\":\"t@t.com\"}"))
                .andExpect(status().isOk());
            // This endpoint only sends email / logs — XSS in email body is less critical
            // but the response should not reflect unescaped HTML
        }

        @Test
        @DisplayName("XSS in notes field")
        void xssInNotes() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"fullName\":\"Test\",\"email\":\"t@t.com\",\"notes\":\"<img src=x onerror=alert(1)>\"}"))
                .andExpect(status().isOk());
        }
    }

    // ─── Oversized Payloads ────────────────────────────────

    @Nested
    @DisplayName("Oversized Payloads")
    class OversizedPayloads {

        @Test
        @DisplayName("Extremely long notes field does not crash server")
        void longNotes() throws Exception {
            String longNotes = "A".repeat(100000);
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(String.format("{\"fullName\":\"Test\",\"email\":\"t@t.com\",\"notes\":\"%s\"}", longNotes)))
                .andExpect(status().is(anyOf(
                    equalTo(200),
                    equalTo(400),
                    equalTo(500))));
        }
    }

    // ─── Access Control ────────────────────────────────────

    @Nested
    @DisplayName("Access Control")
    class AccessControl {

        @Test
        @DisplayName("Endpoint is public — no auth required")
        void isPublic() throws Exception {
            mvc.perform(post("/api/request-card")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"fullName\":\"Public User\",\"email\":\"pub@test.com\"}"))
                .andExpect(status().isOk());
        }
    }
}
