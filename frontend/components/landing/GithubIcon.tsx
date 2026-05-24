"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function GithubIcon({ className }: { className?: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render nothing until mounted
  if (!mounted) {
    return (
      <div className={className} aria-hidden="true" />
    );
  }

  const src = theme === "dark" ? "/github-light.svg" : "/github-dark.svg";

  return (
    <img
      src={src}
      alt="GitHub"
      className={className}
      width={20}
      height={20}
    />
  );
}
