"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import manifest from "@/data/galeria-oculta-capas.json";

/**
 * The hidden gallery's own illustration, split into independent layers so the
 * roses can pulse, the bats flutter and the stars twinkle. Same technique as
 * the home cover (PortadaCapas): layers are cut from one illustration and live
 * in public/galeria-oculta, with their boxes in galeria-oculta-capas.json.
 */

const { width: W, height: H, capas: CAPAS } = manifest as {
  width: number;
  height: number;
  capas: Record<string, { x: number; y: number; w: number; h: number }>;
};

type Springs = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
};

const pct = (n: number, total: number) => `${(n / total) * 100}%`;
const boxStyle = (id: string) => {
  const b = CAPAS[id];
  return {
    left: pct(b.x, W),
    top: pct(b.y, H),
    width: pct(b.w, W),
    height: pct(b.h, H),
  };
};

interface CapaProps {
  id: string;
  mouse: Springs;
  depth?: number;
  origin?: string;
  idle?: TargetAndTransition;
  duration?: number;
  delay?: number;
  /** Fast wing-beat, for the bats. */
  flap?: boolean;
  still: boolean;
}

function Capa({
  id,
  mouse,
  depth = 0,
  origin = "50% 50%",
  idle,
  duration = 12,
  delay = 0,
  flap = false,
  still,
}: CapaProps) {
  const x = useTransform(mouse.sx, (v) => v * depth);
  const y = useTransform(mouse.sy, (v) => v * depth * 0.6);

  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{ ...boxStyle(id), transformOrigin: origin, ...(still ? {} : { x, y }) }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: origin }}
        animate={still ? undefined : idle}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "50% 55%" }}
          animate={still || !flap ? undefined : { scaleY: [1, 0.68, 1, 0.8, 1], scaleX: [1, 1.04, 1, 1.02, 1] }}
          transition={{ duration: 0.7, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={`/galeria-oculta/${id}.webp`}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="select-none"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Estrella({
  id,
  mouse,
  index,
  still,
}: {
  id: string;
  mouse: Springs;
  index: number;
  still: boolean;
}) {
  const b = CAPAS[id];
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const near = useTransform([mouse.px, mouse.py], ([px, py]: number[]) => {
    const d = Math.hypot(px - cx, py - cy);
    return 1 + 0.55 * Math.max(0, 1 - d / 300);
  });
  const scale = useSpring(near, { stiffness: 140, damping: 14 });

  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{ ...boxStyle(id), ...(still ? {} : { scale }) }}
    >
      <motion.div
        className="absolute inset-0"
        animate={still ? undefined : { scale: [0.9, 1.15, 0.9], opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 3 + (index % 4) * 0.8,
          delay: (index * 0.9) % 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image src={`/galeria-oculta/${id}.webp`} alt="" fill unoptimized sizes="100vw" className="select-none" />
      </motion.div>
    </motion.div>
  );
}

/** Drifting paths for the three bats, so none of them flies in step. */
const MURCIELAGOS: { id: string; idle: TargetAndTransition; duration: number; delay: number }[] = [
  { id: "murcielago-1", idle: { x: [0, 36, -14, 0], y: [0, -18, 10, 0], rotate: [-4, 5, -3, -4] }, duration: 13, delay: 0 },
  { id: "murcielago-2", idle: { x: [0, -22, 16, 0], y: [0, 14, -12, 0], rotate: [3, -5, 4, 3] }, duration: 10, delay: 0.3 },
  { id: "murcielago-3", idle: { x: [0, 28, -8, 0], y: [0, -12, 14, 0], rotate: [-3, 4, -4, -3] }, duration: 15, delay: 0.6 },
];

const ROSAS = [
  { id: "rosa-1", duration: 5.2, delay: 0 },
  { id: "rosa-2", duration: 6.4, delay: 1.1 },
  { id: "rosa-3", duration: 5.8, delay: 2 },
  { id: "rosa-4", duration: 6.9, delay: 0.6 },
  { id: "rosa-5", duration: 4.8, delay: 1.7 },
] as const;

const ESTRELLAS = Object.keys(CAPAS).filter((id) => id.startsWith("estrella"));

/**
 * Fetches and decodes every layer ahead of time. Called while the password
 * panel is on screen, so the sweep that follows is not competing with 20
 * images being decoded on the main thread.
 */
export function precargarEscena() {
  const archivos = ["papel.jpg", ...Object.keys(CAPAS).map((id) => `${id}.webp`)];
  for (const archivo of archivos) {
    const img = new window.Image();
    img.src = `/galeria-oculta/${archivo}`;
    img.decode?.().catch(() => {});
  }
}

export default function EscenaOculta() {
  const reduceMotion = !!useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const sx = useSpring(mx, { stiffness: 45, damping: 20 });
  const sy = useSpring(my, { stiffness: 45, damping: 20 });
  const mouse: Springs = { sx, sy, px, py };

  useEffect(() => {
    if (reduceMotion) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
        const r = stageRef.current?.getBoundingClientRect();
        if (r) {
          px.set(((e.clientX - r.left) / r.width) * W);
          py.set(((e.clientY - r.top) / r.height) * H);
        }
      });
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
      px.set(-9999);
      py.set(-9999);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion, mx, my, px, py]);

  const still = reduceMotion;
  const hadaX = useTransform(sx, (v) => v * 9);
  const hadaY = useTransform(sy, (v) => v * 5.4);
  const paperX = useTransform(sx, (v) => v * 3);
  const paperY = useTransform(sy, (v) => v * 2);

  return (
    // Cover for a 3:2 stage; on a tall phone it is wider than the screen and
    // slides slowly from side to side (`animate-pan` in globals.css).
    <div className="absolute inset-0 [--w:max(100vw,150svh)]" aria-hidden>
      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2 aspect-[3/2] max-md:animate-pan md:[translate:var(--shift)_0]"
        style={{
          width: "var(--w)",
          ["--shift" as string]: "max(calc(var(--w) * -0.04), calc((var(--w) - 100vw) * -0.5))",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          className="absolute -inset-[2%]"
          style={still ? undefined : { x: paperX, y: paperY }}
        >
          <Image src="/galeria-oculta/papel.jpg" alt="" fill priority sizes="100vw" className="select-none" />
        </motion.div>

        <Capa id="resto" mouse={mouse} depth={5} still={still} />
        <Capa id="luna" mouse={mouse} depth={8} still={still} idle={{ scale: [1, 1.012, 1] }} duration={14} />
        <Capa id="castillo" mouse={mouse} depth={6} still={still} idle={{ opacity: [0.82, 1, 0.82] }} duration={9} />
        <Capa id="marca" mouse={mouse} depth={6} still={still} idle={{ scale: [1, 1.012, 1] }} duration={12} />

        <motion.div className="absolute inset-0" style={still ? undefined : { x: hadaX, y: hadaY }}>
          <Capa
            id="hada"
            mouse={mouse}
            depth={0}
            still={still}
            origin="70% 92%"
            idle={{ y: [0, -5, 0], rotate: [-0.25, 0.3, -0.25] }}
            duration={8}
          />
        </motion.div>

        {ROSAS.map((r) => (
          <Capa
            key={r.id}
            id={r.id}
            mouse={mouse}
            depth={6}
            still={still}
            idle={{ scale: [1, 1.05, 1], rotate: [-1.4, 1.4, -1.4] }}
            duration={r.duration}
            delay={r.delay}
          />
        ))}

        {MURCIELAGOS.map((m) => (
          <Capa
            key={m.id}
            id={m.id}
            mouse={mouse}
            depth={12}
            still={still}
            flap
            idle={m.idle}
            duration={m.duration}
            delay={m.delay}
          />
        ))}

        {ESTRELLAS.map((id, i) => (
          <Estrella key={id} id={id} mouse={mouse} index={i} still={still} />
        ))}

        <Capa id="marco" mouse={mouse} depth={3} still={still} />
      </div>
    </div>
  );
}
