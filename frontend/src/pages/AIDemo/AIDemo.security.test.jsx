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

vi.mock("./googleLiveApi", () => ({
  loadGIS: vi.fn(() => Promise.resolve(false)),
  requestToken: vi.fn(),
  getUserInfo: vi.fn(),
  createGmailDraft: vi.fn(),
  createCalendarEvent: vi.fn(),
  revokeToken: vi.fn(),
  buildVipEmailHtml: vi.fn(() => "<html></html>"),
}));

vi.mock("../../services/portalTrack", () => ({
  trackPortalEvent: vi.fn(),
}));

function renderDemo() {
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

  it("should render without crashing", () => {
    renderDemo();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/One tap/i);
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

  it("should use target=_blank with rel=noreferrer on external links", () => {
    renderDemo();
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("should show demo Gmail link by default (not live)", () => {
    renderDemo();
    const html = document.body.innerHTML;
    expect(html).not.toContain("Open YOUR draft");
    expect(html).not.toContain("Open YOUR event");
  });

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

  it("should show Seven actions hero copy", () => {
    renderDemo();
    expect(screen.getByText(/Seven actions/i)).toBeTruthy();
  });
});
