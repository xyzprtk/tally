"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlotCardProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

function downloadBase64Image(base64: string, filename: string) {
  const link = document.createElement("a");
  link.href = base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function PlotCard({ src, alt, title, className }: PlotCardProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const handleDownload = useCallback(() => {
    const filename = title ? `${title.replace(/\s+/g, "_").toLowerCase()}.png` : "chart.png";
    downloadBase64Image(src, filename);
  }, [src, title]);

  const imageSrc = src.startsWith("data:") ? src : `data:image/png;base64,${src}`;

  return (
    <>
      <div className={`group relative rounded-xl overflow-hidden border border-border bg-card max-w-3xl mx-auto ${className || ""}`}>
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-auto block"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-start justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-b from-black/30 to-transparent">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="h-8 text-xs backdrop-blur-sm bg-card/90 border border-border hover:bg-muted"
            >
              Download
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFullscreen(true)}
              className="h-8 text-xs backdrop-blur-sm bg-card/90 border border-border hover:bg-muted"
            >
              Fullscreen
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 border-0 bg-transparent ring-0 shadow-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative flex items-center justify-center">
            <img
              src={imageSrc}
              alt={alt}
              className="max-w-full max-h-[85vh] w-auto h-auto rounded-xl shadow-2xl"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs backdrop-blur-sm bg-card/90 border border-border hover:bg-muted"
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
