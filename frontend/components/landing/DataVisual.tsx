"use client";

import { useEffect, useRef } from "react";

interface Distribution {
  name: string;
  heights: number[];
}

const BAR_COUNT = 24;
const ACCENT = "192, 92, 70"; // #C05C46

const distributions: Distribution[] = [
  {
    name: "normal",
    heights: [
      0.05, 0.08, 0.12, 0.2, 0.35, 0.55, 0.75, 0.9,
      1.0, 0.9, 0.75, 0.55, 0.35, 0.2, 0.12, 0.08,
      0.05, 0.03, 0.02, 0.01, 0.01, 0.0, 0.0, 0.0,
    ],
  },
  {
    name: "skewed-right",
    heights: [
      1.0, 0.85, 0.7, 0.55, 0.42, 0.32, 0.24, 0.18,
      0.13, 0.09, 0.06, 0.04, 0.03, 0.02, 0.015, 0.01,
      0.008, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001, 0.0,
    ],
  },
  {
    name: "bimodal",
    heights: [
      0.02, 0.04, 0.08, 0.15, 0.3, 0.55, 0.75, 0.6,
      0.35, 0.15, 0.06, 0.03, 0.015, 0.03, 0.06, 0.15,
      0.35, 0.6, 0.75, 0.55, 0.3, 0.15, 0.08, 0.04,
    ],
  },
  {
    name: "uniform",
    heights: Array(BAR_COUNT).fill(0.55),
  },
  {
    name: "skewed-left",
    heights: [
      0.0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.008,
      0.01, 0.015, 0.02, 0.03, 0.04, 0.06, 0.09, 0.13,
      0.18, 0.24, 0.32, 0.42, 0.55, 0.7, 0.85, 1.0,
    ],
  },
];

export function DataVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const currentHeightsRef = useRef<number[]>([...distributions[0].heights]);
  const targetIndexRef = useRef(0);
  const holdTimerRef = useRef(0);
  const morphProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    let frameCount = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisibleRef.current) return;

      // Throttle to ~30fps
      frameCount++;
      if (frameCount % 2 !== 0) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // --- Morph logic ---
      const target = distributions[targetIndexRef.current].heights;
      const current = currentHeightsRef.current;

      // Smooth lerp factor
      const lerpFactor = 0.04;

      // If close to target, increment hold timer
      const maxDiff = Math.max(
        ...current.map((c, i) => Math.abs(c - target[i]))
      );

      if (maxDiff < 0.015) {
        holdTimerRef.current += 1;
        if (holdTimerRef.current > 90) {
          // ~1.5s hold at 60fps before morphing
          targetIndexRef.current =
            (targetIndexRef.current + 1) % distributions.length;
          holdTimerRef.current = 0;
        }
      }

      // Lerp current heights toward target
      for (let i = 0; i < BAR_COUNT; i++) {
        current[i] += (target[i] - current[i]) * lerpFactor;
      }

      // --- Draw grid lines (subtle) ---
      ctx.strokeStyle = `rgba(${ACCENT}, 0.06)`;
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = h - (h * i) / 5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // --- Draw bars ---
      const gap = 3;
      const barWidth = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const chartHeight = h * 0.85;
      const baselineY = h * 0.92;

      for (let i = 0; i < BAR_COUNT; i++) {
        const barH = current[i] * chartHeight;
        const x = i * (barWidth + gap);
        const y = baselineY - barH;

        // Bar opacity varies with height (taller = more visible)
        const opacity = 0.12 + current[i] * 0.45;

        // Rounded bar top
        const radius = Math.min(barWidth / 2, 3);

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, baselineY);
        ctx.lineTo(x, baselineY);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.fillStyle = `rgba(${ACCENT}, ${opacity})`;
        ctx.fill();

        // Top highlight line on taller bars
        if (current[i] > 0.4) {
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barWidth - radius, y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${0.3 + current[i] * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // --- Floating particles above tallest bars ---
      const maxH = Math.max(...current);
      for (let i = 0; i < BAR_COUNT; i++) {
        if (current[i] > maxH * 0.85) {
          const x = i * (barWidth + gap) + barWidth / 2;
          const y = baselineY - current[i] * chartHeight - 6;
          ctx.beginPath();
          ctx.arc(x, y + Math.sin(frameCount * 0.05 + i) * 2, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
          ctx.fill();
        }
      }

      // --- Baseline ---
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(w, baselineY);
      ctx.strokeStyle = `rgba(${ACCENT}, 0.12)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[300px] md:min-h-[400px]"
      style={{ opacity: 0.9 }}
    />
  );
}
