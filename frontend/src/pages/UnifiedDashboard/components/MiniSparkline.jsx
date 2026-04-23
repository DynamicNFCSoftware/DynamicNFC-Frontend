import { useMemo } from "react";

export default function MiniSparkline({ data = [], color = "#457b9d", width = 64, height = 24 }) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return "";
    const max = Math.max(...data, 1);
    const step = width / (data.length - 1 || 1);
    return data
      .map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${height - (v / max) * (height - 4)}`)
      .join(" ");
  }, [data, width, height]);

  if (!data || data.length === 0 || data.every((v) => v === 0)) {
    return (
      <svg width={width} height={height} style={{ opacity: 0.3 }}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="1.5" strokeDasharray="3,3" />
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(data.length - 1) * (width / (data.length - 1 || 1))}
        cy={height - (data[data.length - 1] / Math.max(...data, 1)) * (height - 4)}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
