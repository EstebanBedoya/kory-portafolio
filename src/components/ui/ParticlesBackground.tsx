"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
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
  particleColor = "rgba(45, 90, 130, 0.4)", // --brand with opacity
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

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Mouse state
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

    const resizeCanvas = () => {
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Scale canvas down via CSS to fit screen
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      ctx.scale(dpr, dpr);
      
      initParticles();
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
          color: particleColor,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Mouse interaction (gravity/repel)
        if (mouse.isHovering) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseInteractionRadius) {
            // Repel particles
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // The closer the mouse, the stronger the push
            const force = (mouseInteractionRadius - distance) / mouseInteractionRadius;
            
            p.x -= forceDirectionX * force * 2;
            p.y -= forceDirectionY * force * 2;
          }
        }

        // Keep inside bounds after interaction
        p.x = Math.max(0, Math.min(window.innerWidth, p.x));
        p.y = Math.max(0, Math.min(window.innerHeight, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Opacity based on distance
            const opacity = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor.replace(
              /[\d.]+\)$/g,
              `${(opacity * 0.2).toFixed(2)})`
            ); // Adjust alpha value string hacking for neatness, or assume rgba passed in
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, particleColor, lineColor, maxDistance, mouseInteractionRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "transparent",
      }}
      aria-hidden="true"
    />
  );
}
