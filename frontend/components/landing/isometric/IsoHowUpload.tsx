"use client";

export function IsoHowUpload({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        .how-upload-file { animation: howUploadBob 3s ease-in-out infinite; }
        @keyframes howUploadBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .how-upload-line { animation: howUploadLine 2s ease-in-out infinite; }
        @keyframes howUploadLine {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Open tray / platform */}
        <path d="M36 88 L60 76 L84 88 L60 100 Z" fill="currentColor" fillOpacity="0.04" />
        <path d="M36 88 L60 76 L84 88 L60 100 Z" />
        <path d="M44 88 L60 80 L76 88" opacity="0.3" />

        {/* File sheet, mid-drop with bob */}
        <g className="how-upload-file">
          <path d="M48 52 L68 42 L68 62 L48 72 Z" fill="currentColor" fillOpacity="0.08" />
          <path d="M48 52 L68 42 L68 62 L48 72 Z" />
          <path d="M60 46 L60 54 L52 58" fill="currentColor" fillOpacity="0.12" />
          <path d="M60 46 L60 54 L52 58" opacity="0.7" />
          <path d="M60 46 L52 58" opacity="0.5" />
          <path d="M48 52 L48 49 L68 39 L68 42" opacity="0.5" />
          <path d="M48 49 L68 39" opacity="0.4" />
        </g>

        {/* Motion lines suggesting downward movement */}
        <path d="M42 56 L42 64" opacity="0.4" className="how-upload-line" />
        <path d="M76 52 L76 60" opacity="0.3" className="how-upload-line" />
        <path d="M38 50 L38 58" opacity="0.25" className="how-upload-line" />
      </g>
    </svg>
  );
}
