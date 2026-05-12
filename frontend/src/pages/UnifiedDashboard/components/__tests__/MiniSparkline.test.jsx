import { describe, it, expect } from "vitest";
import { renderWith } from "../../../../testUtils/renderWith";
import MiniSparkline from "../MiniSparkline";

describe("MiniSparkline", () => {
  it("renders placeholder dashed line for empty data", () => {
    const { container } = renderWith(<MiniSparkline data={[]} />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("line")).toBeTruthy();
    expect(container.querySelector("path")).toBeNull();
  });

  it("renders placeholder for all-zero data", () => {
    const { container } = renderWith(<MiniSparkline data={[0, 0, 0]} />);
    expect(container.querySelector("line")).toBeTruthy();
    expect(container.querySelector("path")).toBeNull();
  });

  it("renders svg path and endpoint circle for non-empty data", () => {
    const { container } = renderWith(<MiniSparkline data={[1, 3, 2]} />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("path")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("applies custom color to rendered line/path", () => {
    const { container } = renderWith(<MiniSparkline data={[2, 4, 6]} color="#ff00aa" />);
    const path = container.querySelector("path");
    expect(path).toBeTruthy();
    expect(path?.getAttribute("stroke")).toBe("#ff00aa");
  });

  it("honors custom width and height props on svg", () => {
    const { container } = renderWith(<MiniSparkline data={[1, 2, 3]} width={100} height={40} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("100");
    expect(svg?.getAttribute("height")).toBe("40");
  });
});

