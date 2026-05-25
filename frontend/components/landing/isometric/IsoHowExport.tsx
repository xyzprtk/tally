"use client";

export function IsoHowExport({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .how-export-arrow { animation: howExportDown 2.5s ease-in-out infinite; }
        @keyframes howExportDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .how-export-check { animation: howExportCheck 3s ease-in-out infinite; }
        @keyframes howExportCheck {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* File sheet (the data being exported) */}
        <path d="M44 42 L64 32 L64 52 L44 62 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M44 42 L64 32 L64 52 L44 62 Z" />
        <path d="M56 36 L56 44 L48 48" fill="currentColor" fillOpacity="0.1" />
        <path d="M56 36 L56 44 L48 48" opacity="0.6" />
        <path d="M56 36 L48 48" opacity="0.4" />
        <path d="M44 42 L44 39 L64 29 L64 32" opacity="0.5" />
        <path d="M44 39 L64 29" opacity="0.4" />

        {/* Bold downward arrow through file */}
        <g className="how-export-arrow">
          <path d="M54 56 L54 78" strokeWidth="2" opacity="0.7" />
          <path d="M50 74 L54 78 L58 74" strokeWidth="2" opacity="0.7" />
        </g>

        {/* Checkmark ring below (completion) */}
        <g className="how-export-check">
          <circle cx="54" cy="88" r="5" fill="currentColor" fillOpacity="0.08" />
          <circle cx="54" cy="88" r="5" />
          <path d="M51 88 L53 90 L57 86" strokeWidth="1.5" opacity="0.7" />
        </g>

        {/* Small trailing particles */}
        <circle cx="48" cy="66" r="1" fill="currentColor" opacity="0.3" />
        <circle cx="60" cy="64" r="1.2" fill="currentColor" opacity="0.25" />
      </g>
    </svg>
  );
}
