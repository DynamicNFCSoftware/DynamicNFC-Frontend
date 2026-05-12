import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

/**
 * Wrap test render with shared providers used by dashboard pages.
 *
 * Usage:
 *   renderWith(<MyComponent />);
 *   renderWith(<MyComponent />, { route: "/some/path" });
 */
export function renderWith(ui, { route = "/" } = {}) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

