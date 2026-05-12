import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { DashboardDataContext, useDashboard } from "../useDashboard";

describe("useDashboard", () => {
  it("exports a usable context object", () => {
    expect(DashboardDataContext).toBeTruthy();
    expect(DashboardDataContext.Provider).toBeTruthy();
  });

  it("throws when hook is used outside provider", () => {
    expect(() => renderHook(() => useDashboard())).toThrow(/useDashboard must be inside/i);
  });

  it("returns context value inside provider", () => {
    const value = { events: [], vips: [], deals: [] };
    const wrapper = ({ children }) => <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;

    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current).toBe(value);
  });

  it("keeps same reference on rerender when context value is stable", () => {
    const stableValue = { events: ["e1"] };
    const wrapper = ({ children }) => <DashboardDataContext.Provider value={stableValue}>{children}</DashboardDataContext.Provider>;

    const { result, rerender } = renderHook(() => useDashboard(), { wrapper });
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("returns new reference when provider value changes", () => {
    const valueA = { events: [] };
    const valueB = { events: ["new"] };
    let currentValue = valueA;
    const wrapper = ({ children }) => <DashboardDataContext.Provider value={currentValue}>{children}</DashboardDataContext.Provider>;

    const { result, rerender } = renderHook(() => useDashboard(), { wrapper });
    const firstRef = result.current;

    currentValue = valueB;
    rerender();
    expect(result.current).not.toBe(firstRef);
    expect(result.current).toBe(valueB);
  });

  it("supports nested providers and uses nearest provider value", () => {
    const outer = { source: "outer" };
    const inner = { source: "inner" };
    const wrapper = ({ children }) => (
      <DashboardDataContext.Provider value={outer}>
        <DashboardDataContext.Provider value={inner}>{children}</DashboardDataContext.Provider>
      </DashboardDataContext.Provider>
    );

    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current).toBe(inner);
  });
});

