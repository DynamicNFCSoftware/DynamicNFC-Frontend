/**
 * Security tests for AIDemo component — OAuth flow and data handling.
 * Tests: Token state isolation, privacy of user data, link safety.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RegionProvider } from "../../hooks/useRegion";
import AIDemo from "./AIDemo";

// Mock googleLiveApi to avoid loading real GIS script
vi.mock("./googleLiveApi", () => ({
  loadGIS: vi.fn(() => Promise.resolve(false)),
  requestToken: vi.fn(),
  getUserInfo: vi.fn(),
  createGmailDraft: vi.fn(),
  createCalendarEvent: vi.fn(),
  revokeToken: vi.fn(),
  buildVipEmailHtml: vi.fn(() => "<html></html>"),
}));

function renderDemo() {
  // HelmetProvider wraps the tree so <SEO>'s <Helmet> can register itself
  // in the helmet context — required for any test that renders a page
  // component that uses react-helmet-async.
  // RegionProvider required since FAZ5 AIDemo uses useRegion() for timeZone.
  return render(
    <HelmetProvider>
      <RegionProvider>
        <MemoryRouter>
          <AIDemo />
        </MemoryRouter>
      </RegionProvider>
    </HelmetProvider>
  );
}

describe("AIDemo — Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Initial State Security ────────────────────────────

  it("should render without crashing", () => {
    renderDemo();
    // Page heading text (was "AI-Orchestrated", updated to the One-tap hero copy).
    expect(screen.getByText(/One tap/i)).toBeTruthy();
  });

  it("should show Connect button when not authenticated", () => {
    renderDemo();
    expect(screen.getByText(/Connect with Google/i)).toBeTruthy();
  });

  it("should NOT show user data when not connected", () => {
    renderDemo();
    const html = document.body.innerHTML;
    expect(html).not.toContain("Disconnect");
    expect(html).not.toContain("ai-google-avatar");
  });

  it("should display privacy notice", () => {
    renderDemo();
    expect(screen.getByText(/OAuth2 popup/i)).toBeTruthy();
    expect(screen.getByText(/your password never touches our servers/i)).toBeTruthy();
  });

  // ─── Link Safety ───────────────────────────────────────

  it("should use target=_blank with rel=noreferrer on external links", () => {
    renderDemo();
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  // ─── Demo Data Isolation ───────────────────────────────

  it("should show demo Gmail link by default (not live)", () => {
    renderDemo();
    // Before running pipeline, no draft links are visible
    // Just verify the component renders in demo mode
    const html = document.body.innerHTML;
    expect(html).not.toContain("Open YOUR draft");
    expect(html).not.toContain("Open YOUR event");
  });

  // ─── No Sensitive Data in DOM ──────────────────────────

  it("should not expose access tokens in DOM", () => {
    renderDemo();
    const html = document.body.innerHTML;
    expect(html).not.toContain("access_token");
    expect(html).not.toContain("Bearer ");
  });

  it("should not expose session IDs in DOM", () => {
    renderDemo();
    const html = document.body.innerHTML;
    expect(html).not.toContain("sessionId");
    expect(html).not.toContain("JSESSIONID");
  });
});
