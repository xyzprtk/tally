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
      <style>{`
        .node-center { animation: nodePulse 4s ease-in-out infinite; }
        .node-1 { animation: nodePulse 4s ease-in-out 0.5s infinite; }
        .node-2 { animation: nodePulse 4s ease-in-out 1s infinite; }
        .node-3 { animation: nodePulse 4s ease-in-out 1.5s infinite; }
        .node-4 { animation: nodePulse 4s ease-in-out 2s infinite; }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        .code-flicker { animation: codeFlicker 5s ease-in-out infinite; }
        @keyframes codeFlicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .arrow-flow { animation: arrowFlow 3s ease-in-out infinite; }
        @keyframes arrowFlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Speech bubble (isometric panel) */}
        <path d="M35 55 L60 42 L85 55 L60 68 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M35 55 L60 42 L85 55 L60 68 Z" />
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
          className="code-flicker"
        >
          {"</>"}
        </text>

        {/* Arrow from bubble down to network */}
        <path d="M60 72 L60 85" strokeWidth="1.5" strokeDasharray="3 2" className="arrow-flow" opacity="0.5" />
        <path d="M57 82 L60 85 L63 82" strokeWidth="1.5" className="arrow-flow" opacity="0.5" />

        {/* Network node structure below */}
        {/* Central node */}
        <circle cx="60" cy="92" r="4" fill="currentColor" fillOpacity="0.12" className="node-center" />
        <circle cx="60" cy="92" r="4" className="node-center" />

        {/* Surrounding nodes */}
        <circle cx="48" cy="88" r="2.5" fill="currentColor" fillOpacity="0.08" className="node-1" />
        <circle cx="48" cy="88" r="2.5" className="node-1" />
        <circle cx="72" cy="88" r="2.5" fill="currentColor" fillOpacity="0.08" className="node-2" />
        <circle cx="72" cy="88" r="2.5" className="node-2" />
        <circle cx="54" cy="100" r="2.5" fill="currentColor" fillOpacity="0.08" className="node-3" />
        <circle cx="54" cy="100" r="2.5" className="node-3" />
        <circle cx="66" cy="100" r="2.5" fill="currentColor" fillOpacity="0.08" className="node-4" />
        <circle cx="66" cy="100" r="2.5" className="node-4" />

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
