"use client";

export function IsoVisualizations({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Wireframe cube */}
        {/* Bottom face */}
        <path d="M40 80 L60 70 L80 80 L60 90 Z" opacity="0.5" />
        {/* Top face */}
        <path d="M40 55 L60 45 L80 55 L60 65 Z" opacity="0.7" />
        {/* Vertical edges */}
        <path d="M40 55 L40 80" />
        <path d="M60 45 L60 70" />
        <path d="M80 55 L80 80" />
        <path d="M60 65 L60 90" opacity="0.5" />

        {/* Scatter dots inside the cube (at various depths) */}
        {/* Front layer */}
        <circle cx="50" cy="72" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="68" cy="62" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="58" cy="78" r="1.8" fill="currentColor" opacity="0.6" />
        {/* Back layer (smaller, lighter) */}
        <circle cx="55" cy="58" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="72" cy="52" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="48" cy="65" r="1.3" fill="currentColor" opacity="0.35" />
        {/* Highlighted outlier with ring */}
        <circle cx="62" cy="68" r="2.5" fill="currentColor" opacity="0.8" />
        <circle cx="62" cy="68" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Axis labels */}
        <text x="35" y="50" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.5">x</text>
        <text x="82" y="52" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.5">y</text>
        <text x="62" y="40" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.5">z</text>
      </g>
    </svg>
  );
}
