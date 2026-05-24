"use client";

export function IsoHowAsk({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .how-ask-arrow { animation: howAskArrow 3s ease-in-out infinite; }
        @keyframes howAskArrow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .how-ask-question { animation: howAskPulse 4s ease-in-out infinite; }
        @keyframes howAskPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .how-ask-code { animation: howAskCode 5s ease-in-out infinite; }
        @keyframes howAskCode {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Speech bubble */}
        <path d="M40 40 L60 30 L80 40 L60 50 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M40 40 L60 30 L80 40 L60 50 Z" />
        <path d="M40 40 L40 36 L60 26 L60 30" opacity="0.5" />
        <path d="M80 40 L80 36 L60 26" opacity="0.5" />
        <path d="M40 36 L60 26 L80 36" opacity="0.4" />

        {/* Question mark */}
        <text
          x="60"
          y="44"
          fill="currentColor"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          fontWeight="600"
          textAnchor="middle"
          className="how-ask-question"
        >
          ?
        </text>

        {/* Arrow from bubble to code */}
        <path d="M60 54 L60 72" strokeDasharray="3 2" className="how-ask-arrow" opacity="0.4" />
        <path d="M57 69 L60 72 L63 69" className="how-ask-arrow" opacity="0.4" />

        {/* Code block below */}
        <path d="M44 78 L60 70 L76 78 L60 86 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M44 78 L60 70 L76 78 L60 86 Z" />
        <path d="M44 78 L44 74 L60 66 L60 70" opacity="0.5" />
        <path d="M76 78 L76 74 L60 66" opacity="0.5" />
        <path d="M44 74 L60 66 L76 74" opacity="0.4" />

        {/* Code symbols */}
        <text
          x="60"
          y="80"
          fill="currentColor"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fontWeight="500"
          textAnchor="middle"
          className="how-ask-code"
        >
          {"</>"}
        </text>

        {/* Tiny plot line inside code block */}
        <path d="M52 84 L54 82 L56 83 L58 80 L60 82" strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
}
