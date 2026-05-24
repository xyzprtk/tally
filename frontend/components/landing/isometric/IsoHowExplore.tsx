"use client";

export function IsoHowExplore({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .how-explore-chart { animation: howChartGrow 4s ease-in-out infinite; }
        @keyframes howChartGrow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.06); }
        }
        .how-explore-mag { animation: howMagSweep 5s ease-in-out infinite; }
        @keyframes howMagSweep {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, -1px); }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Spreadsheet grid surface */}
        <path d="M28 85 L60 70 L92 85 L60 100 Z" fill="currentColor" fillOpacity="0.03" />
        <path d="M28 85 L60 70 L92 85" />
        <path d="M60 100 L60 70" opacity="0.3" />

        {/* Grid lines */}
        <path d="M44 77.5 L76 93.5" opacity="0.25" />
        <path d="M36 81.5 L68 97.5" opacity="0.25" />
        <path d="M52 73.5 L84 89.5" opacity="0.25" />
        <path d="M44 77.5 L44 93.5" opacity="0.25" />
        <path d="M76 77.5 L76 93.5" opacity="0.25" />

        {/* Mini bar chart popping out of one cell */}
        <g className="how-explore-chart" style={{ transformOrigin: "60px 75px" }}>
          <path d="M52 65 L52 50 L58 47 L58 62 Z" fill="currentColor" fillOpacity="0.08" />
          <path d="M52 65 L52 50 L58 47 L58 62 Z" />
          <path d="M52 50 L58 47" />
          <path d="M58 47 L58 62" />

          <path d="M60 60 L60 42 L66 39 L66 57 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M60 60 L60 42 L66 39 L66 57 Z" />
          <path d="M60 42 L66 39" />
          <path d="M66 39 L66 57" />

          <path d="M68 55 L68 45 L74 42 L74 52 Z" fill="currentColor" fillOpacity="0.06" />
          <path d="M68 55 L68 45 L74 42 L74 52 Z" />
          <path d="M68 45 L74 42" />
          <path d="M74 42 L74 52" />
        </g>

        {/* Magnifying glass sweeping */}
        <g className="how-explore-mag">
          <ellipse cx="76" cy="72" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.7" />
          <path d="M82 68 L88 64" strokeWidth="2" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
}
