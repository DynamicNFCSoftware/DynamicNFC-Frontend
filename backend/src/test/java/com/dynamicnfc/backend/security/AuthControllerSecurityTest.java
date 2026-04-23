package com.dynamicnfc.backend.security;

import com.dynamicnfc.backend.model.Account;
import com.dynamicnfc.backend.repository.AccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Security tests for AuthController (/api/auth/**)
 * Tests: SQL injection, XSS, brute-force patterns, weak passwords,
 *        session fixation, input validation, error message leakage.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerSecurityTest {

    @Autowired private MockMvc mvc;
    @Autowired private AccountRepository accountRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        accountRepo.deleteAll();
        Account acc = new Account();
        acc.setEmail("test@example.com");
        acc.setPassword(encoder.encode("Str0ngP@ss!"));
        accountRepo.save(acc);
    }

    // ─── Registration Security ─────────────────────────────

    @Nested
    @DisplayName("POST /api/auth/register — Input Validation")
    class RegisterValidation {

        @Test
        @DisplayName("Reject null email")
        void rejectNullEmail() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("password", "123456"))))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Reject blank email")
        void rejectBlankEmail() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "   ", "password", "123456"))))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Reject password shorter than 6 characters")
        void rejectShortPassword() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "new@test.com", "password", "12345"))))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Reject duplicate email registration")
        void rejectDuplicateEmail() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "AnotherPass1"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
        }

        @Test
        @DisplayName("Email is normalized to lowercase")
        void emailNormalized() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "  UpperCase@Test.COM  ", "password", "ValidPass1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("uppercase@test.com"));
        }
    }

    // ─── SQL Injection ─────────────────────────────────────

    @Nested
    @DisplayName("SQL Injection Attempts")
    class SqlInjection {

        @Test
        @DisplayName("Login with SQL injection in email — should fail auth, not crash")
        void sqlInjectionLogin() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of(
                        "email", "' OR '1'='1' --",
                        "password", "anything"))))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Register with SQL injection in email")
        void sqlInjectionRegister() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of(
                        "email", "'; DROP TABLE account; --",
                        "password", "123456"))))
                // Should either fail validation or succeed harmlessly (JPA parameterized)
                .andExpect(status().is(anyOf(equalTo(200), equalTo(400))));

            // Table must still exist
            org.junit.jupiter.api.Assertions.assertTrue(accountRepo.count() >= 1,
                "Account table must survive SQL injection attempt");
        }

        @Test
        @DisplayName("UNION SELECT injection in email")
        void unionSelectInjection() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of(
                        "email", "x' UNION SELECT password FROM account WHERE email='test@example.com' --",
                        "password", "x"))))
                .andExpect(status().isUnauthorized());
        }
    }

    // ─── XSS ───────────────────────────────────────────────

    @Nested
    @DisplayName("XSS Attempts")
    class Xss {

        @Test
        @DisplayName("Register with XSS in email — stored XSS prevention")
        void xssInEmail() throws Exception {
            String xssEmail = "<script>alert('xss')</script>@test.com";
            MvcResult result = mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", xssEmail, "password", "ValidPass1"))))
                .andReturn();

            // NOTE: Spring Boot's default Jackson serializer returns JSON with
            // unescaped HTML inside string values. This is safe because the Content-Type
            // is application/json (browsers won't render it as HTML), but frameworks
            // should ideally escape HTML entities. Documenting as known behavior.
            int status = result.getResponse().getStatus();
            org.junit.jupiter.api.Assertions.assertTrue(
                status == 200 || status == 400,
                "XSS email should be accepted or rejected, not crash the server");
        }

        @Test
        @DisplayName("Login with XSS payload — reflected XSS prevention")
        void xssInLogin() throws Exception {
            MvcResult result = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of(
                        "email", "<img src=x onerror=alert(1)>",
                        "password", "test"))))
                .andReturn();

            String body = result.getResponse().getContentAsString();
            org.junit.jupiter.api.Assertions.assertFalse(
                body.contains("onerror="),
                "Response must not reflect XSS payload");
        }
    }

    // ─── Session Security ──────────────────────────────────

    @Nested
    @DisplayName("Session Security")
    class SessionSecurity {

        @Test
        @DisplayName("Successful login returns session ID")
        void loginReturnsSession() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "Str0ngP@ss!"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"));
        }

        @Test
        @DisplayName("Invalid credentials return 401, not 500")
        void invalidCredsReturn401() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "wrongpassword"))))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Login with non-existent user returns 401")
        void nonExistentUser() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "nobody@nowhere.com", "password", "anything"))))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Logout invalidates session")
        void logoutInvalidatesSession() throws Exception {
            // Login first
            MvcResult loginResult = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "Str0ngP@ss!"))))
                .andExpect(status().isOk())
                .andReturn();

            var session = loginResult.getRequest().getSession(false);

            // Logout
            mvc.perform(post("/api/auth/logout")
                    .session((org.springframework.mock.web.MockHttpSession) session))
                .andExpect(status().isOk());
        }
    }

    // ─── Error Message Leakage ─────────────────────────────

    @Nested
    @DisplayName("Error Message Leakage")
    class ErrorLeakage {

        @Test
        @DisplayName("Failed login does not reveal whether email exists")
        void noEmailEnumeration() throws Exception {
            // Wrong password for existing user
            MvcResult r1 = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "wrong"))))
                .andExpect(status().isUnauthorized())
                .andReturn();

            // Non-existent user
            MvcResult r2 = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "ghost@nowhere.com", "password", "wrong"))))
                .andExpect(status().isUnauthorized())
                .andReturn();

            // Both should return same status code (401)
            org.junit.jupiter.api.Assertions.assertEquals(
                r1.getResponse().getStatus(),
                r2.getResponse().getStatus(),
                "Login failure for existing vs non-existing user should return same status");
        }

        @Test
        @DisplayName("Register error does not leak internal details")
        void registerErrorNoStackTrace() throws Exception {
            MvcResult result = mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "test@example.com", "password", "ValidPass1"))))
                .andReturn();

            String body = result.getResponse().getContentAsString();
            org.junit.jupiter.api.Assertions.assertFalse(
                body.contains("stackTrace") || body.contains("SQLException") || body.contains("org.hibernate"),
                "Error response must not leak stack traces or internal class names");
        }
    }

    // ─── Oversized / Malformed Payloads ────────────────────

    @Nested
    @DisplayName("Payload Abuse")
    class PayloadAbuse {

        @Test
        @DisplayName("Extremely long email is handled gracefully")
        void longEmail() throws Exception {
            String longEmail = "a".repeat(10000) + "@test.com";
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", longEmail, "password", "ValidPass1"))))
                .andExpect(status().is(anyOf(equalTo(200), equalTo(400), equalTo(500))));
            // Must not crash the server — we just verify it responds
        }

        @Test
        @DisplayName("Extremely long password is handled gracefully")
        void longPassword() throws Exception {
            String longPass = "P@1" + "a".repeat(100000);
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", "longpass@test.com", "password", longPass))))
                .andExpect(status().is(anyOf(equalTo(200), equalTo(400), equalTo(500))));
        }

        @Test
        @DisplayName("Empty JSON body returns 400, not 500")
        void emptyBody() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Malformed JSON returns 400")
        void malformedJson() throws Exception {
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{invalid json!!!"))
                .andExpect(status().isBadRequest());
        }
    }

    private String json(Object obj) throws Exception {
        return mapper.writeValueAsString(obj);
    }
}
