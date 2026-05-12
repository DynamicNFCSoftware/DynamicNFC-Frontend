import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWith } from "../../../../testUtils/renderWith";
import KpiCard from "../KpiCard";

vi.mock("../AnimatedCounter", () => ({
  default: ({ value, suffix = "", prefix = "" }) => (
    <span data-testid="animated-counter">{`${prefix}${value}${suffix}`}</span>
  ),
}));

describe("KpiCard", () => {
  it("renders label text", () => {
    renderWith(<KpiCard label="Active VIPs" value={12} subtitle="named buyers" color="#457b9d" />);
    expect(screen.getByText("Active VIPs")).toBeTruthy();
  });

  it("renders animated counter for numeric values", () => {
    renderWith(<KpiCard label="Pipeline" value={42} subtitle="open deals" color="#457b9d" prefix="$" suffix="M" />);
    expect(screen.getByTestId("animated-counter").textContent).toBe("$42M");
  });

  it("renders raw value for non-numeric input", () => {
    renderWith(<KpiCard label="NFC ROI" value="—" subtitle="not available" color="#457b9d" />);
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("uses displayOverride instead of value renderer when provided", () => {
    renderWith(
      <KpiCard
        label="Decision window"
        value={88}
        subtitle="median"
        color="#457b9d"
        displayOverride={<span data-testid="override-value">custom-view</span>}
      />
    );
    expect(screen.getByTestId("override-value")).toBeTruthy();
    expect(screen.queryByTestId("animated-counter")).toBeNull();
  });

  it("renders sparkline slot content", () => {
    renderWith(
      <KpiCard
        label="Lead Capture"
        value={17}
        subtitle="anon -> identified"
        color="#457b9d"
        sparkline={<span data-testid="sparkline-slot">sparkline</span>}
      />
    );
    expect(screen.getByTestId("sparkline-slot")).toBeTruthy();
  });

  it("applies provided color to KPI value style", () => {
    renderWith(<KpiCard label="Hot leads" value={9} subtitle="active" color="#e63946" />);
    const valueEl = document.querySelector(".ud-kpi-value");
    expect(valueEl).toBeTruthy();
    expect(valueEl?.getAttribute("style")).toContain("rgb(230, 57, 70)");
  });

  it("renders subtitle text content", () => {
    renderWith(<KpiCard label="Avg score" value={72} subtitle="weighted last 7 days" color="#457b9d" />);
    expect(screen.getByText("weighted last 7 days")).toBeTruthy();
  });
});

