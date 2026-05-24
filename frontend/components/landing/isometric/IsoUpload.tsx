"use client";

export function IsoUpload({ className }: { className?: string }) {
  // Isometric unit vectors: right=(10,5), left=(-10,5), up=(0,-12)
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Open box base */}
        {/* Bottom face */}
        <path d="M60 92 L70 97 L60 102 L50 97 Z" fill="currentColor" fillOpacity="0.04" />
        {/* Front-left wall */}
        <path d="M50 97 L50 85 L60 80 L60 92" fill="currentColor" fillOpacity="0.03" />
        {/* Front-right wall */}
        <path d="M60 92 L60 80 L70 85 L70 97" fill="currentColor" fillOpacity="0.03" />
        {/* Back walls (thinner lines, lighter) */}
        <path d="M50 85 L60 80 L70 85" opacity="0.4" />
        <path d="M60 102 L60 92" opacity="0.4" />

        {/* Falling file (thin isometric rectangle, tilted) */}
        <g transform="translate(0, -18) rotate(-8 60 60)">
          {/* File body */}
          <path d="M54 55 L64 50 L74 55 L64 60 Z" fill="currentColor" fillOpacity="0.06" />
          <path d="M54 55 L64 60 L74 55" />
          <path d="M64 50 L64 60" />
          {/* File thickness (sides going up) */}
          <path d="M54 55 L54 52 L64 47 L64 50" opacity="0.6" />
          <path d="M74 55 L74 52 L64 47" opacity="0.6" />
          <path d="M54 52 L64 47 L74 52" opacity="0.6" />
          {/* Folded corner detail */}
          <path d="M68 48 L68 52 L64 54" opacity="0.5" />
        </g>

        {/* Trailing data dots */}
        <circle cx="52" cy="42" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="58" cy="38" r="1.2" fill="currentColor" opacity="0.3" />
        <circle cx="48" cy="35" r="1" fill="currentColor" opacity="0.2" />
      </g>
    </svg>
  );
}
