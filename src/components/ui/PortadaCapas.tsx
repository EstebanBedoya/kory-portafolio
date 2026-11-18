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
import Link from "next/link";
import { useEffect, useRef } from "react";
import manifest from "@/data/portada-capas.json";

/**
 * The cover illustration, split into independent layers (paper, moon, flowers,
 * fairy, wings, mist, wordmark, frame and every star) so each can move on its
 * own. Layers are cut from the single illustration by scripts kept outside the
 * repo; the files live in public/portada and their boxes in portada-capas.json.
 *
 * Everything reacts to the pointer: layers drift by a depth-weighted amount,
 * the wings lean into it and each star swells as the cursor nears.
 */

const { width: W, height: H, capas: CAPAS } = manifest as {
  width: number;
  height: number;
  capas: Record<string, { x: number; y: number; w: number; h: number }>;
};

type Springs = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  /** Cursor position in illustration pixels. */
  px: MotionValue<number>;
  py: MotionValue<number>;
};

const pct = (n: number, total: number) => `${(n / total) * 100}%`;

interface CapaProps {
  id: string;
  mouse: Springs;
  /** Pointer drift in px at full deflection. Deeper layers move more. */
  depth?: number;
  /** Degrees of lean per unit of pointer deflection. */
  lean?: number;
  origin?: string;
  idle?: TargetAndTransition;
  duration?: number;
  delay?: number;
  still: boolean;
}

/** One cut-out of the illustration, positioned by its box in the 3:2 stage. */
function Capa({
  id,
  mouse,
  depth = 0,
  lean = 0,
  origin = "50% 50%",
  idle,
  duration = 12,
  delay = 0,
  still,
}: CapaProps) {
  const box = CAPAS[id];
  const x = useTransform(mouse.sx, (v) => v * depth);
  const y = useTransform(mouse.sy, (v) => v * depth * 0.6);
  const rotate = useTransform(mouse.sx, (v) => v * lean);

  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{
        left: pct(box.x, W),
        top: pct(box.y, H),
        width: pct(box.w, W),
        height: pct(box.h, H),
        transformOrigin: origin,
        ...(still ? {} : { x, y, rotate }),
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: origin }}
        animate={still ? undefined : idle}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={`/portada/${id}.webp`}
          alt=""
          fill
          unoptimized
          priority={id === "marco"}
          sizes="100vw"
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}

interface EstrellaProps {
  id: string;
  mouse: Springs;
  index: number;
  still: boolean;
}

/** A star that twinkles on its own and swells as the cursor comes near. */
function Estrella({ id, mouse, index, still }: EstrellaProps) {
  const box = CAPAS[id];
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;

  const near = useTransform([mouse.px, mouse.py], ([px, py]: number[]) => {
    const d = Math.hypot(px - cx, py - cy);
    return 1 + 0.55 * Math.max(0, 1 - d / 300);
  });
  const scale = useSpring(near, { stiffness: 140, damping: 14 });

  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{
        left: pct(box.x, W),
        top: pct(box.y, H),
        width: pct(box.w, W),
        height: pct(box.h, H),
        ...(still ? {} : { scale }),
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={still ? undefined : { scale: [0.9, 1.14, 0.9], opacity: [0.55, 1, 0.55] }}
        transition={{
          duration: 3.4 + (index % 5) * 0.9,
          delay: (index * 0.73) % 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={`/portada/${id}.webp`}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * A small, softly glowing star beside the tower. It is the way into the hidden
 * gallery, so it has no visible label — only an accessible one.
 */
// `size` is the clickable area; the glint itself is drawn at about half of it,
// so it stays a small spark while remaining easy to hit.
const SECRETA = { x: 1402, y: 548, size: 0.05 }; // illustration px; width as share of the stage

function EstrellaSecreta({ quieta = false }: { quieta?: boolean }) {
  return (
    <Link
      href="/galeria-oculta"
      aria-label="Galería oculta"
      className="group pointer-events-auto absolute flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      style={{
        left: pct(SECRETA.x, W),
        top: pct(SECRETA.y, H),
        width: `${SECRETA.size * 100}%`,
        aspectRatio: "1",
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.svg
        viewBox="-50 -50 100 100"
        aria-hidden
        className="h-1/2 w-1/2 overflow-visible transition-transform duration-500 group-hover:scale-[1.6] group-focus-visible:scale-[1.6]"
        animate={quieta ? undefined : { scale: [0.8, 1.12, 0.8], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          filter:
            "drop-shadow(0 0 3px rgba(255, 244, 214, 0.95)) drop-shadow(0 0 9px rgba(255, 236, 190, 0.5))",
        }}
      >
        {/* A glint: long thin rays, a fainter diagonal pair and a bright core. */}
        <path
          d="M0 -50 Q1.5 -1.5 50 0 Q1.5 1.5 0 50 Q-1.5 1.5 -50 0 Q-1.5 -1.5 0 -50Z"
          fill="#FFF4D6"
        />
        <path
          d="M0 -26 Q1 -1 26 0 Q1 1 0 26 Q-1 1 -26 0 Q-1 -1 0 -26Z"
          fill="#FFF4D6"
          opacity="0.6"
          transform="rotate(45)"
        />
        <circle r="3.5" fill="#FFFFFF" />
      </motion.svg>
    </Link>
  );
}

const ESTRELLAS = Object.keys(CAPAS).filter(
  (id) => id.startsWith("estrella") || id.startsWith("esquina"),
);

export default function PortadaCapas() {
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
  const paperX = useTransform(sx, (v) => v * 3);
  const paperY = useTransform(sy, (v) => v * 2);
  const hadaX = useTransform(sx, (v) => v * 9);
  const hadaY = useTransform(sy, (v) => v * 5.4);

  return (
    // `cover` for a 3:2 stage: as wide as the screen, or as wide as 1.5x the
    // height, whichever is larger. On a tall phone screen the stage is wider
    // than the viewport and pans slowly (see `animate-pan` in globals.css).
    <div
      className="absolute inset-0 [--w:max(100vw,150svh)]"
      aria-hidden
    >
      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2 aspect-[3/2] max-md:animate-pan md:[translate:var(--shift)_0]"
        style={{
          width: "var(--w)",
          // Keep the wordmark and fairy balanced: lean 8% right of centre, but
          // never past the stage's own edge.
          ["--shift" as string]:
            "max(calc(var(--w) * -0.08), calc((var(--w) - 100vw) * -0.5))",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* The paper with the ink removed. Slightly oversized so the pointer
            drift never uncovers its edge. */}
        <motion.div
          className="absolute -inset-[2%]"
          style={still ? undefined : { x: paperX, y: paperY }}
        >
          <Image
            src="/portada/papel.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="select-none"
          />
        </motion.div>

        {/* Layers that touch share nearly the same drift: the cuts between them
            run through the drawing, so a large difference would show a seam.
            The big, obvious motion is kept for pieces with paper around them:
            the stars, the wordmark and the tips of the wings. */}
        <Capa id="resto" mouse={mouse} depth={6} still={still} />
        <Capa
          id="luna"
          mouse={mouse}
          depth={9}
          still={still}
        />
        <Capa
          id="flores"
          mouse={mouse}
          depth={6}
          lean={0.3}
          still={still}
          origin="30% 96%"
          idle={{ rotate: [-0.5, 0.6, -0.5] }}
          duration={13}
        />
        <Capa
          id="bruma"
          mouse={mouse}
          depth={8}
          still={still}
          idle={{ x: [-3, 3, -3], y: [0, 3, 0] }}
          duration={15}
        />
        <Capa
          id="marca"
          mouse={mouse}
          depth={6}
          still={still}
          idle={{ scale: [1, 1.01, 1] }}
          duration={16}
        />

        {/* The fairy floats as one body; the wings are hung from it and sway
            from their root, leaning into the pointer. */}
        <motion.div
          className="absolute inset-0"
          style={still ? undefined : { x: hadaX, y: hadaY }}
        >
          <motion.div
            className="absolute inset-0"
            animate={still ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Capa id="hada" mouse={mouse} depth={0} still={still} />
            <Capa
              id="alas"
              mouse={mouse}
              depth={0}
              lean={2.2}
              still={still}
              origin="5% 69%"
              idle={{ rotate: [-1.5, 1.1, -1.5], skewY: [0, 0.5, 0] }}
              duration={7}
            />
            {!still && <EstrellaSecreta />}
            {still && <EstrellaSecreta quieta />}
          </motion.div>
        </motion.div>

        <Capa id="marco" mouse={mouse} depth={3} still={still} />

        {ESTRELLAS.map((id, i) => (
          <Estrella key={id} id={id} mouse={mouse} index={i} still={still} />
        ))}
      </div>
    </div>
  );
}
