package com.dynamicnfc.backend.security;

import com.dynamicnfc.backend.util.HashIdUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Security tests for HashIdUtil — ID obfuscation layer.
 * Tests: unpredictability, null safety, collision resistance,
 *        reversibility, and input edge cases.
 */
class HashIdUtilSecurityTest {

    private HashIdUtil hashIdUtil;

    @BeforeEach
    void setUp() {
        hashIdUtil = new HashIdUtil();
    }

    // ─── Unpredictability ──────────────────────────────────

    @Nested
    @DisplayName("Unpredictability — Sequential IDs must not produce sequential hashes")
    class Unpredictability {

        @Test
        @DisplayName("Consecutive IDs produce different-looking hashes")
        void consecutiveIdsDiffer() {
            String h1 = hashIdUtil.encode(1L);
            String h2 = hashIdUtil.encode(2L);
            String h3 = hashIdUtil.encode(3L);

            assertNotEquals(h1, h2);
            assertNotEquals(h2, h3);

            // Hashes should not share a common prefix (beyond chance)
            // At minimum they should differ in their first 3 chars
            boolean allSamePrefix = h1.substring(0, 3).equals(h2.substring(0, 3))
                && h2.substring(0, 3).equals(h3.substring(0, 3));
            assertFalse(allSamePrefix,
                "Sequential IDs should not produce hashes with identical prefixes");
        }

        @Test
        @DisplayName("Cannot predict next hashId from previous")
        void cannotPredictNext() {
            String h100 = hashIdUtil.encode(100L);
            String h101 = hashIdUtil.encode(101L);

            // The hashes should be substantially different
            int diffChars = 0;
            int minLen = Math.min(h100.length(), h101.length());
            for (int i = 0; i < minLen; i++) {
                if (h100.charAt(i) != h101.charAt(i)) diffChars++;
            }
            assertTrue(diffChars >= 2,
                "Adjacent IDs should produce hashes differing in at least 2 characters");
        }
    }

    // ─── Null & Edge Case Safety ───────────────────────────

    @Nested
    @DisplayName("Null & Edge Case Safety")
    class NullSafety {

        @Test
        @DisplayName("Encode null returns null")
        void encodeNull() {
            assertNull(hashIdUtil.encode(null));
        }

        @Test
        @DisplayName("Decode null returns null")
        void decodeNull() {
            assertNull(hashIdUtil.decode(null));
        }

        @Test
        @DisplayName("Decode empty string returns null")
        void decodeEmpty() {
            assertNull(hashIdUtil.decode(""));
        }

        @Test
        @DisplayName("Decode whitespace returns null")
        void decodeWhitespace() {
            assertNull(hashIdUtil.decode("   "));
        }

        @Test
        @DisplayName("Decode random garbage returns null, not exception")
        void decodeGarbage() {
            assertNull(hashIdUtil.decode("!@#$%^&*()"));
            assertNull(hashIdUtil.decode("SELECT * FROM users"));
            assertNull(hashIdUtil.decode("<script>alert(1)</script>"));
        }

        @Test
        @DisplayName("Encode zero is valid")
        void encodeZero() {
            // HashIds may not support 0 depending on config — just verify no exception
            assertDoesNotThrow(() -> hashIdUtil.encode(0L));
        }

        @Test
        @DisplayName("Encode negative number handled gracefully")
        void encodeNegative() {
            // Negative IDs should not occur, but verify no crash
            assertDoesNotThrow(() -> hashIdUtil.encode(-1L));
        }
    }

    // ─── Reversibility ─────────────────────────────────────

    @Nested
    @DisplayName("Reversibility — Encode/Decode round-trip")
    class Reversibility {

        @Test
        @DisplayName("Round-trip for various IDs")
        void roundTrip() {
            long[] ids = {1L, 2L, 42L, 100L, 999L, 123456L, 999999L};
            for (long id : ids) {
                String hash = hashIdUtil.encode(id);
                Long decoded = hashIdUtil.decode(hash);
                assertEquals(id, decoded, "Round-trip failed for ID: " + id);
            }
        }

        @Test
        @DisplayName("isValid returns true for valid hashes")
        void isValidTrue() {
            String hash = hashIdUtil.encode(42L);
            assertTrue(hashIdUtil.isValid(hash));
        }

        @Test
        @DisplayName("isValid returns false for invalid hashes")
        void isValidFalse() {
            assertFalse(hashIdUtil.isValid("zzzzzzzz"));
            assertFalse(hashIdUtil.isValid(""));
            assertFalse(hashIdUtil.isValid(null));
        }
    }

    // ─── Minimum Length ────────────────────────────────────

    @Nested
    @DisplayName("Minimum Hash Length")
    class MinLength {

        @Test
        @DisplayName("All hashes are at least 6 characters")
        void minLength() {
            for (long id = 1; id <= 100; id++) {
                String hash = hashIdUtil.encode(id);
                assertTrue(hash.length() >= 6,
                    "Hash for ID " + id + " is too short: " + hash);
            }
        }
    }
}
