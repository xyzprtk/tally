"use client";

export function IsoLLMChat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Speech bubble (isometric panel) */}
        {/* Bubble face */}
        <path d="M35 55 L60 42 L85 55 L60 68 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M35 55 L60 42 L85 55 L60 68 Z" />
        {/* Bubble thickness (depth) */}
        <path d="M35 55 L35 48 L60 35 L60 42" opacity="0.5" />
        <path d="M85 55 L85 48 L60 35" opacity="0.5" />
        <path d="M35 48 L60 35 L85 48" opacity="0.5" />

        {/* Code bracket inside bubble */}
        <text
          x="60"
          y="59"
          fill="currentColor"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          fontWeight="500"
          textAnchor="middle"
          opacity="0.8"
        >
          {"</>"}
        </text>

        {/* Arrow from bubble down to network */}
        <path d="M60 72 L60 85" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
        <path d="M57 82 L60 85 L63 82" strokeWidth="1.5" opacity="0.5" />

        {/* Network node structure below */}
        {/* Central node */}
        <circle cx="60" cy="92" r="4" fill="currentColor" fillOpacity="0.12" />
        <circle cx="60" cy="92" r="4" />

        {/* Surrounding nodes */}
        <circle cx="48" cy="88" r="2.5" fill="currentColor" fillOpacity="0.08" />
        <circle cx="48" cy="88" r="2.5" />
        <circle cx="72" cy="88" r="2.5" fill="currentColor" fillOpacity="0.08" />
        <circle cx="72" cy="88" r="2.5" />
        <circle cx="54" cy="100" r="2.5" fill="currentColor" fillOpacity="0.08" />
        <circle cx="54" cy="100" r="2.5" />
        <circle cx="66" cy="100" r="2.5" fill="currentColor" fillOpacity="0.08" />
        <circle cx="66" cy="100" r="2.5" />

        {/* Connecting lines */}
        <path d="M60 92 L48 88" opacity="0.4" />
        <path d="M60 92 L72 88" opacity="0.4" />
        <path d="M60 92 L54 100" opacity="0.4" />
        <path d="M60 92 L66 100" opacity="0.4" />
        <path d="M48 88 L54 100" opacity="0.25" />
        <path d="M72 88 L66 100" opacity="0.25" />
      </g>
    </svg>
  );
}
