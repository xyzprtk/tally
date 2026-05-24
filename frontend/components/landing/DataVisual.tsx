"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface Wave {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
  phase: number;
}

export function DataVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const wavesRef = useRef<Wave[]>([]);
  const isVisibleRef = useRef(true);

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

    // Init particles
    const particleCount = 40;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    // Init waves
    wavesRef.current = [
      { amplitude: 30, frequency: 0.008, speed: 0.02, yOffset: 0.3, phase: 0 },
      { amplitude: 20, frequency: 0.012, speed: 0.015, yOffset: 0.5, phase: Math.PI / 3 },
      { amplitude: 25, frequency: 0.006, speed: 0.025, yOffset: 0.7, phase: Math.PI / 1.5 },
    ];

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

      // Skip frames for performance (30fps feel)
      frameCount++;
      if (frameCount % 2 !== 0) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Draw waves
      wavesRef.current.forEach((wave) => {
        wave.phase += wave.speed;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(192, 92, 70, 0.15)";
        ctx.lineWidth = 2;

        for (let x = 0; x <= w; x += 2) {
          const y =
            h * wave.yOffset +
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 92, 70, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(192, 92, 70, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
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
      style={{ opacity: 0.8 }}
    />
  );
}
