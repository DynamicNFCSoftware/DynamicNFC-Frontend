// Placeholder hull silhouette rendered until real yacht photography lands.
// One simple inline SVG per vessel type; the wrapper card supplies the gradient.

const PATHS = {
  // motor yacht — flybridge profile
  motor: "M4 40 L58 40 L54 48 L10 48 Z M12 40 L14 30 L44 30 L50 40 M16 30 L18 22 L38 22 L42 30 M46 40 L52 36",
  // sport yacht — low sleek hardtop
  sport: "M4 42 L60 42 L54 49 L10 49 Z M10 42 L18 33 L48 33 L54 42 M20 33 L24 28 L44 30",
  // explorer — high bow, portuguese bridge
  explorer: "M4 42 L58 42 L54 49 L10 49 Z M10 42 L12 30 L20 24 L46 24 L48 34 L52 42 M22 24 L24 17 L40 17 L42 24",
  // sportfish — tuna tower + cockpit
  sportfish: "M4 42 L56 42 L52 49 L10 49 Z M14 42 L16 32 L40 32 L44 42 M22 32 L24 14 L34 14 L34 32 M20 14 L38 14",
  // superyacht — multi-deck + helipad
  superyacht: "M2 42 L62 42 L58 50 L8 50 Z M8 42 L10 32 L54 32 L56 42 M14 32 L16 24 L50 24 L52 32 M20 24 L22 17 L44 17 L46 24 M26 12 L40 12",
};

export default function YachtSilhouette({ type = "motor", className = "" }) {
  const d = PATHS[type] || PATHS.motor;
  return (
    <svg className={className} viewBox="0 0 64 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d={d} />
      <path d="M2 50 q6 3 12 0 t12 0 t12 0 t12 0 t12 0" opacity="0.5" />
    </svg>
  );
}
