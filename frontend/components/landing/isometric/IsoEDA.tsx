"use client";

export function IsoEDA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .magnify-bob { animation: magnifyBob 5s ease-in-out infinite; }
        @keyframes magnifyBob {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -2px); }
        }
        .warn-1 { animation: warnPulse 3s ease-in-out infinite; }
        .warn-2 { animation: warnPulse 3s ease-in-out 1.5s infinite; }
        @keyframes warnPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }
        .check-stroke { animation: checkDraw 4s ease-in-out infinite; }
        @keyframes checkDraw {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Isometric grid/table surface */}
        <path d="M25 85 L60 68 L95 85 L60 102 Z" fill="currentColor" fillOpacity="0.03" />
        <path d="M25 85 L60 68 L95 85" />
        <path d="M60 102 L60 68" opacity="0.3" />

        {/* Grid lines (3x3 cells) */}
        <path d="M42.5 76.5 L77.5 93.5" opacity="0.3" />
        <path d="M35 80.5 L70 97.5" opacity="0.3" />
        <path d="M50 73 L85 90" opacity="0.3" />
        <path d="M42.5 76.5 L42.5 93.5" opacity="0.3" />
        <path d="M60 68 L60 102" opacity="0.2" />
        <path d="M77.5 76.5 L77.5 93.5" opacity="0.3" />

        {/* Magnifying glass hovering above one cell */}
        <g className="magnify-bob" transform="translate(0, -12)">
          <ellipse cx="52" cy="68" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.8" />
          <path d="M59 63 L66 58" strokeWidth="2" opacity="0.7" />
          <path d="M65 59 L67 57" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Warning triangles near cells */}
        <g className="warn-1" transform="translate(72, 82)">
          <path d="M0 -5 L4 3 L-4 3 Z" fill="currentColor" fillOpacity="0.12" strokeWidth="1" opacity="0.6" />
          <text x="0" y="1.5" fill="currentColor" fontSize="5" textAnchor="middle" fontFamily="ui-monospace, monospace" opacity="0.7">!</text>
        </g>

        <g className="warn-2" transform="translate(38, 88)">
          <path d="M0 -4 L3.5 2.5 L-3.5 2.5 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="1" opacity="0.5" />
          <text x="0" y="1.2" fill="currentColor" fontSize="4.5" textAnchor="middle" fontFamily="ui-monospace, monospace" opacity="0.6">!</text>
        </g>

        {/* Checkmark in one cell */}
        <path d="M56 82 L58 85 L62 80" strokeWidth="1.5" className="check-stroke" />
      </g>
    </svg>
  );
}
