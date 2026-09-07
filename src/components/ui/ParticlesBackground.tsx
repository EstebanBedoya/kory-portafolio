"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface ParticlesProps {
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  maxDistance?: number;
  mouseInteractionRadius?: number;
}

export default function ParticlesBackground({
  particleCount = 150,
  particleColor = "rgba(45, 90, 130, 0.4)",
  lineColor = "rgba(45, 90, 130, 0.15)",
  maxDistance = 150,
  mouseInteractionRadius = 150,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const mouse = { x: -1000, y: -1000, isHovering: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const initParticles = () => {
      particles = [];
      const count =
        window.innerWidth < 768
          ? Math.floor(particleCount / 2) // fewer particles on mobile
          : particleCount;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.8, // subtle movement
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3.5 + 1.5,
        });
      }
    };

    const resizeCanvas = () => {
      // Assigning width/height resets the context transform, so the DPR
      // scale below is applied once per resize rather than accumulating.
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      initParticles();
      if (reduceMotion) render();
    };

    const advance = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        if (mouse.isHovering) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouseInteractionRadius && distance > 0) {
            // The closer the pointer, the stronger the push away from it.
            const force =
              (mouseInteractionRadius - distance) / mouseInteractionRadius;
            p.x -= (dx / distance) * force * 2;
            p.y -= (dy / distance) * force * 2;
          }
        }

        p.x = Math.max(0, Math.min(window.innerWidth, p.x));
        p.y = Math.max(0, Math.min(window.innerHeight, p.y));
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Connections first, varying globalAlpha instead of rebuilding a colour
      // string per segment per frame.
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distance >= maxDistance) continue;

          ctx.globalAlpha = (1 - distance / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = particleColor;

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      advance();
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    if (reduceMotion) {
      // Keep the texture, drop the motion: one static frame, no listeners.
      render();
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      loop();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    particleCount,
    particleColor,
    lineColor,
    maxDistance,
    mouseInteractionRadius,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
