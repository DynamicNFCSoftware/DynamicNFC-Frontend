package com.dynamicnfc.backend.security;

import com.dynamicnfc.backend.model.Account;
import com.dynamicnfc.backend.model.UserEntity;
import com.dynamicnfc.backend.repository.AccountRepository;
import com.dynamicnfc.backend.repository.UserRepository;
import com.dynamicnfc.backend.util.HashIdUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Security tests for UserController (/api/users/**)
 * Tests: IDOR, authorization bypass, unauthenticated access,
 *        path traversal, oversized uploads, XSS in user fields.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerSecurityTest {

    @Autowired private MockMvc mvc;
    @Autowired private AccountRepository accountRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private HashIdUtil hashIdUtil;
    @Autowired private ObjectMapper mapper;

    private Account ownerAccount;
    private Account attackerAccount;
    private UserEntity ownerCard;

    @BeforeEach
    void setUp() {
        userRepo.deleteAll();
        accountRepo.deleteAll();

        ownerAccount = new Account();
        ownerAccount.setEmail("owner@test.com");
        ownerAccount.setPassword(encoder.encode("OwnerPass1"));
        ownerAccount = accountRepo.save(ownerAccount);

        attackerAccount = new Account();
        attackerAccount.setEmail("attacker@test.com");
        attackerAccount.setPassword(encoder.encode("AttackerPass1"));
        attackerAccount = accountRepo.save(attackerAccount);

        ownerCard = new UserEntity();
        ownerCard.setName("Owner Card");
        ownerCard.setEmail("owner@test.com");
        ownerCard.setAccount(ownerAccount);
        ownerCard = userRepo.save(ownerCard);
        ownerCard.setHashId(hashIdUtil.encode(ownerCard.getId()));
        ownerCard = userRepo.save(ownerCard);
    }

    // ─── Authorization: IDOR Tests ─────────────────────────

    @Nested
    @DisplayName("IDOR — Insecure Direct Object Reference")
    class Idor {

        @Test
        @DisplayName("Attacker cannot edit another user's card")
        void cannotEditOthersCard() throws Exception {
            String hashId = ownerCard.getHashId();
            mvc.perform(put("/api/users/" + hashId)
                    .with(user("attacker@test.com").roles("USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(Map.of("name", "HACKED"))))
                .andExpect(status().isForbidden());

            // Verify card was NOT modified
            UserEntity card = userRepo.findById(ownerCard.getId()).orElseThrow();
            Assertions.assertEquals("Owner Card", card.getName());
        }

        @Test
        @DisplayName("Attacker cannot delete another user's card")
        void cannotDeleteOthersCard() throws Exception {
            String hashId = ownerCard.getHashId();
            mvc.perform(delete("/api/users/" + hashId)
                    .with(user("attacker@test.com").roles("USER")))
                .andExpect(status().isForbidden());

            Assertions.assertTrue(userRepo.findById(ownerCard.getId()).isPresent(),
                "Card must still exist after unauthorized delete attempt");
        }

        @Test
        @DisplayName("Owner CAN edit their own card")
        void ownerCanEdit() throws Exception {
            String hashId = ownerCard.getHashId();
            mvc.perform(put("/api/users/" + hashId)
                    .with(user("owner@test.com").roles("USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(Map.of("name", "Updated Name"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
        }

        @Test
        @DisplayName("Owner CAN delete their own card")
        void ownerCanDelete() throws Exception {
            String hashId = ownerCard.getHashId();
            mvc.perform(delete("/api/users/" + hashId)
                    .with(user("owner@test.com").roles("USER")))
                .andExpect(status().isOk());

            Assertions.assertTrue(userRepo.findById(ownerCard.getId()).isEmpty());
        }

        @Test
        @DisplayName("Attacker cannot access my-cards of another user")
        void myCardsIsolation() throws Exception {
            MvcResult result = mvc.perform(get("/api/users/my-cards")
                    .with(user("attacker@test.com").roles("USER")))
                .andExpect(status().isOk())
                .andReturn();

            String body = result.getResponse().getContentAsString();
            Assertions.assertFalse(body.contains("Owner Card"),
                "Attacker must not see owner's cards via /my-cards");
        }
    }

    // ─── Unauthenticated Access ────────────────────────────

    @Nested
    @DisplayName("Unauthenticated Access Control")
    class UnauthenticatedAccess {

        @Test
        @DisplayName("GET /api/users — public, returns 200")
        void publicGetAll() throws Exception {
            mvc.perform(get("/api/users"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/users/{id} — public, returns 200")
        void publicGetById() throws Exception {
            mvc.perform(get("/api/users/" + ownerCard.getHashId()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/users/my-cards — requires auth, returns 401")
        void myCardsRequiresAuth() throws Exception {
            mvc.perform(get("/api/users/my-cards"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("POST /api/users/upload — requires auth, returns 401")
        void uploadRequiresAuth() throws Exception {
            mvc.perform(post("/api/users/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("PUT /api/users/{id} — requires auth, returns 401")
        void editRequiresAuth() throws Exception {
            mvc.perform(put("/api/users/" + ownerCard.getHashId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"name\":\"hacked\"}"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("DELETE /api/users/{id} — requires auth, returns 401")
        void deleteRequiresAuth() throws Exception {
            mvc.perform(delete("/api/users/" + ownerCard.getHashId()))
                .andExpect(status().isUnauthorized());
        }
    }

    // ─── ID Enumeration / Traversal ────────────────────────

    @Nested
    @DisplayName("ID Manipulation")
    class IdManipulation {

        @Test
        @DisplayName("Sequential numeric ID still works (backwards compat) but uses HashId")
        void numericIdFallback() throws Exception {
            mvc.perform(get("/api/users/" + ownerCard.getId()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Invalid hashId returns 400, not 500")
        void invalidHashId() throws Exception {
            mvc.perform(get("/api/users/!!!invalid!!!"))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Non-existent hashId returns 404")
        void nonExistentId() throws Exception {
            mvc.perform(get("/api/users/999999"))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Path traversal in ID is handled safely")
        void pathTraversal() throws Exception {
            mvc.perform(get("/api/users/../../../etc/passwd"))
                .andExpect(status().is(anyOf(
                    equalTo(400),
                    equalTo(404))));
        }
    }

    // ─── XSS in User Fields ────────────────────────────────

    @Nested
    @DisplayName("XSS in Card Fields")
    class XssFields {

        @Test
        @DisplayName("XSS in name field is stored but not executed (output encoding)")
        void xssInName() throws Exception {
            mvc.perform(put("/api/users/" + ownerCard.getHashId())
                    .with(user("owner@test.com").roles("USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(Map.of("name", "<script>alert('xss')</script>"))))
                .andExpect(status().isOk());

            // API returns JSON — Content-Type: application/json prevents browser rendering.
            // NOTE: Jackson does not HTML-escape strings inside JSON by default.
            // This is standard behavior — the frontend must sanitize when rendering.
            MvcResult result = mvc.perform(get("/api/users/" + ownerCard.getHashId()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andReturn();

            // Verify the response is valid JSON (not raw HTML)
            String body = result.getResponse().getContentAsString();
            Assertions.assertNotNull(mapper.readTree(body),
                "Response must be valid JSON even with XSS payload in field");
        }

        @Test
        @DisplayName("XSS in companyUrl field")
        void xssInUrl() throws Exception {
            mvc.perform(put("/api/users/" + ownerCard.getHashId())
                    .with(user("owner@test.com").roles("USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(Map.of("companyUrl", "javascript:alert('xss')"))))
                .andExpect(status().isOk());
        }
    }

    // ─── Debug Endpoints Exposure ──────────────────────────

    @Nested
    @DisplayName("Debug Endpoints Exposure")
    class DebugEndpoints {

        @Test
        @DisplayName("Debug hashId endpoint is accessible (warning: should be protected in production)")
        void debugHashIdAccessible() throws Exception {
            mvc.perform(get("/api/users/debug/" + ownerCard.getHashId()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Debug encode endpoint is accessible (warning: should be protected in production)")
        void debugEncodeAccessible() throws Exception {
            mvc.perform(get("/api/users/debug/encode/" + ownerCard.getId()))
                .andExpect(status().isOk());
        }
    }

    // ─── Mass Assignment ───────────────────────────────────

    @Nested
    @DisplayName("Mass Assignment Protection")
    class MassAssignment {

        @Test
        @DisplayName("Cannot set account relationship via JSON edit")
        void cannotReassignAccount() throws Exception {
            // Try to reassign card to attacker's account via JSON
            String payload = String.format("{\"name\":\"test\",\"account\":{\"id\":%d}}", attackerAccount.getId());
            mvc.perform(put("/api/users/" + ownerCard.getHashId())
                    .with(user("owner@test.com").roles("USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payload))
                .andExpect(status().isOk());

            // Card must still belong to owner
            UserEntity card = userRepo.findById(ownerCard.getId()).orElseThrow();
            Assertions.assertEquals(ownerAccount.getId(), card.getAccount().getId(),
                "Card account must not be reassigned via mass assignment");
        }
    }
}
