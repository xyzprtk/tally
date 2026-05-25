"use client";

export function IsoUpload({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .upload-file { animation: uploadFloat 4s ease-in-out infinite; }
        @keyframes uploadFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .upload-dot { animation: uploadPulse 3s ease-in-out infinite; }
        .upload-dot-2 { animation: uploadPulse 3s ease-in-out 1s infinite; }
        .upload-dot-3 { animation: uploadPulse 3s ease-in-out 2s infinite; }
        @keyframes uploadPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Flat platform / landing tray */}
        <path d="M36 88 L60 76 L84 88 L60 100 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M36 88 L60 76 L84 88 L60 100 Z" />
        <path d="M44 88 L60 80 L76 88" opacity="0.3" />

        {/* File - clean isometric sheet floating above center */}
        <g className="upload-file">
          <path d="M50 56 L70 46 L70 66 L50 76 Z" fill="currentColor" fillOpacity="0.08" />
          <path d="M50 56 L70 46 L70 66 L50 76 Z" />
          <path d="M62 50 L62 58 L54 62" fill="currentColor" fillOpacity="0.12" />
          <path d="M62 50 L62 58 L54 62" opacity="0.7" />
          <path d="M62 50 L54 62" opacity="0.5" />
          <path d="M50 56 L50 53 L70 43 L70 46" opacity="0.5" />
          <path d="M50 53 L70 43" opacity="0.4" />
        </g>

        {/* Small upward motion indicator dots */}
        <circle cx="46" cy="44" r="1.5" fill="currentColor" className="upload-dot" />
        <circle cx="52" cy="38" r="1.2" fill="currentColor" className="upload-dot-2" />
        <circle cx="42" cy="34" r="1" fill="currentColor" className="upload-dot-3" />

        {/* Tiny file outline below main file */}
        <path d="M56 82 L64 78 L64 86 L56 90 Z" fill="currentColor" fillOpacity="0.04" opacity="0.5" />
        <path d="M56 82 L64 78 L64 86 L56 90 Z" opacity="0.4" />
      </g>
    </svg>
  );
}
