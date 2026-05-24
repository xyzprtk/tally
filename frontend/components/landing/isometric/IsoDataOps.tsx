"use client";

export function IsoDataOps({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .funnel-particle-1 { animation: funnelDrop1 3s ease-in-out infinite; }
        .funnel-particle-2 { animation: funnelDrop2 3s ease-in-out 1s infinite; }
        .funnel-particle-3 { animation: funnelDrop3 3s ease-in-out 2s infinite; }
        @keyframes funnelDrop1 {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(4px); opacity: 0.8; }
        }
        @keyframes funnelDrop2 {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(3px); opacity: 0.7; }
        }
        @keyframes funnelDrop3 {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(5px); opacity: 0.6; }
        }
        .exit-particle { animation: exitPulse 2.5s ease-in-out infinite; }
        @keyframes exitPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Funnel top (wide rectangle) */}
        <path d="M30 50 L60 35 L90 50 L60 65 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M30 50 L60 35 L90 50" />
        <path d="M60 65 L60 35" opacity="0.3" />

        {/* Funnel walls narrowing down */}
        <path d="M30 50 L42 75 L48 72 L36 48" fill="currentColor" fillOpacity="0.03" />
        <path d="M90 50 L78 75 L72 72 L84 48" fill="currentColor" fillOpacity="0.03" />
        <path d="M30 50 L42 75" />
        <path d="M90 50 L78 75" />
        <path d="M42 75 L60 82 L78 75" />
        <path d="M48 72 L60 78 L72 72" opacity="0.5" />

        {/* Data particles entering top with staggered drop */}
        <g className="funnel-particle-1">
          <rect x="45" y="42" width="4" height="4" fill="currentColor" opacity="0.5" transform="rotate(45 47 44)" />
        </g>
        <g className="funnel-particle-2">
          <rect x="58" y="38" width="3.5" height="3.5" fill="currentColor" opacity="0.4" transform="rotate(45 59.75 39.75)" />
        </g>
        <g className="funnel-particle-3">
          <rect x="70" y="44" width="4" height="4" fill="currentColor" opacity="0.5" transform="rotate(45 72 46)" />
        </g>

        {/* Filtered particles exiting bottom */}
        <g className="exit-particle">
          <rect x="54" y="88" width="3" height="3" fill="currentColor" opacity="0.7" transform="rotate(45 55.5 89.5)" />
        </g>
        <rect x="60" y="92" width="2.5" height="2.5" fill="currentColor" opacity="0.5" transform="rotate(45 61.25 93.25)" />

        {/* Filter icon embedded in wall */}
        <path d="M60 58 L56 65 L60 62 L64 65 Z" fill="currentColor" fillOpacity="0.15" />
        <path d="M60 58 L56 65 L60 62 L64 65 Z" opacity="0.6" />
      </g>
    </svg>
  );
}
