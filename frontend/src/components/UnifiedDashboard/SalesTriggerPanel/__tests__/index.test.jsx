import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWith } from "../../../../testUtils/renderWith";
import SalesTriggerPanel from "../index";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  trackDashboardEvent: vi.fn(),
  detectTriggers: vi.fn(() => ({ hot: [], warm: [] })),
  dashboardState: { events: [], vips: [], deals: [] },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock("../../../../pages/UnifiedDashboard/useDashboard", () => ({
  useDashboard: () => mocks.dashboardState,
}));

vi.mock("../../../../hooks/useRegion", () => ({
  useRegion: () => ({ regionId: "gulf", region: { sidebarAccent: "#b8860b" } }),
}));

vi.mock("../../../../hooks/useSector", () => ({
  useSector: () => ({ config: { id: "realEstate" } }),
}));

vi.mock("../../../../i18n", () => ({
  useTranslation: () => (key) => key,
}));

vi.mock("../../../../services/firestoreTracking", () => ({
  trackDashboardEvent: (...args) => mocks.trackDashboardEvent(...args),
}));

vi.mock("../triggerRules", () => ({
  detectTriggers: (...args) => mocks.detectTriggers(...args),
}));

describe("SalesTriggerPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dashboardState = { events: [], vips: [], deals: [] };
    mocks.detectTriggers.mockReturnValue({ hot: [], warm: [] });
  });

  it("renders empty state when no triggers exist", () => {
    renderWith(<SalesTriggerPanel />);
    expect(screen.getByText(/No active triggers/i)).toBeTruthy();
    expect(document.querySelectorAll(".stp-row").length).toBe(0);
  });

  it("renders one HOT row with urgency class", () => {
    mocks.detectTriggers.mockReturnValue({
      hot: [
        {
          id: "HIGH_INTENT:khalid:stpSignalPricing",
          ruleType: "HIGH_INTENT",
          urgency: "hot",
          vipId: "khalid",
          vipName: "Khalid Al-Rashid",
          score: 87,
          signalKey: "stpSignalPricing",
          signalArgs: {},
          lastEventAt: Date.now() - 120000,
        },
      ],
      warm: [],
    });

    renderWith(<SalesTriggerPanel />);
    expect(screen.getByText("Khalid Al-Rashid")).toBeTruthy();
    expect(document.querySelectorAll('.stp-row[data-urgency="hot"]').length).toBe(1);
  });

  it("renders divider when both HOT and WARM buckets are non-empty", () => {
    const now = Date.now();
    mocks.detectTriggers.mockReturnValue({
      hot: [
        { id: "h1", ruleType: "HIGH_INTENT", urgency: "hot", vipId: "v1", vipName: "VIP 1", score: 80, signalKey: "stpSignalPricing", signalArgs: {}, lastEventAt: now - 1000 },
      ],
      warm: [
        { id: "w1", ruleType: "RE_ENGAGE", urgency: "warm", vipId: "v2", vipName: "VIP 2", score: 55, signalKey: "stpSignalReEngage", signalArgs: { hours: 24 }, lastEventAt: now - 2000 },
      ],
    });

    renderWith(<SalesTriggerPanel />);
    expect(document.querySelector(".stp-divider")).toBeTruthy();
  });

  it("shows score chip when score exists and hides when score is null", () => {
    const now = Date.now();
    mocks.detectTriggers.mockReturnValue({
      hot: [
        { id: "h1", ruleType: "HIGH_INTENT", urgency: "hot", vipId: "v1", vipName: "VIP 1", score: 80, signalKey: "stpSignalPricing", signalArgs: {}, lastEventAt: now - 1000 },
        { id: "h2", ruleType: "HIGH_INTENT", urgency: "hot", vipId: "v2", vipName: "VIP 2", score: null, signalKey: "stpSignalPricing", signalArgs: {}, lastEventAt: now - 1500 },
      ],
      warm: [],
    });

    renderWith(<SalesTriggerPanel />);
    expect(screen.getByText("80")).toBeTruthy();
    expect(document.querySelectorAll(".stp-score").length).toBe(1);
  });

  it("tracks trigger_acted_on when Open profile is clicked", () => {
    const now = Date.now();
    mocks.detectTriggers.mockReturnValue({
      hot: [
        { id: "h1", ruleType: "HIGH_INTENT", urgency: "hot", vipId: "khalid", vipName: "Khalid", score: 87, signalKey: "stpSignalPricing", signalArgs: {}, lastEventAt: now - 2000 },
      ],
      warm: [],
    });

    renderWith(<SalesTriggerPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Open profile" }));

    expect(mocks.trackDashboardEvent).toHaveBeenCalledTimes(1);
    expect(mocks.trackDashboardEvent).toHaveBeenCalledWith(
      "trigger_acted_on",
      expect.objectContaining({ vipId: "khalid", ruleType: "HIGH_INTENT" })
    );
  });

  it("navigates to VIP CRM deeplink state on Open profile", () => {
    const now = Date.now();
    mocks.detectTriggers.mockReturnValue({
      hot: [
        { id: "h1", ruleType: "CONTACT_AGENT", urgency: "hot", vipId: "fatima", vipName: "Fatima", score: 91, signalKey: "stpSignalContact", signalArgs: {}, lastEventAt: now - 2000 },
      ],
      warm: [],
    });

    renderWith(<SalesTriggerPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Open profile" }));

    expect(mocks.navigate).toHaveBeenCalledWith("/unified/vip-crm", { state: { vipId: "fatima" } });
  });
});

