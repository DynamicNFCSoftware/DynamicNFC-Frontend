export default function AiBadge({ text = "" }) {
  return (
    <span className="ud-ai-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22l-.75-12.07A4.001 4.001 0 0 1 12 2z" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      {text}
    </span>
  );
}
