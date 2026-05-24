"use client";

export function IsoStats({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Base plane */}
        <path d="M30 90 L60 75 L90 90 L60 105 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M30 90 L60 75 L90 90" />
        <path d="M60 105 L60 75" opacity="0.4" />

        {/* Bar 1 (shortest) */}
        <path d="M38 85 L38 72 L48 67 L48 80 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M38 85 L38 72 L48 67 L48 80 Z" />
        <path d="M38 72 L48 67" />
        <path d="M48 67 L48 80" />
        <path d="M38 72 L48 67" />

        {/* Bar 2 (tallest) */}
        <path d="M52 78 L52 52 L62 47 L62 73 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M52 78 L52 52 L62 47 L62 73 Z" />
        <path d="M52 52 L62 47" />
        <path d="M62 47 L62 73" />

        {/* Bar 3 (medium) */}
        <path d="M66 71 L66 58 L76 53 L76 66 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M66 71 L66 58 L76 53 L76 66 Z" />
        <path d="M66 58 L76 53" />
        <path d="M76 53 L76 66" />

        {/* Sigma symbol floating above tallest bar */}
        <text
          x="57"
          y="42"
          fill="currentColor"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          fontWeight="500"
          opacity="0.7"
        >
          σ
        </text>
      </g>
    </svg>
  );
}
