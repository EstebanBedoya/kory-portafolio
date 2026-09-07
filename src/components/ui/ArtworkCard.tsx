"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/motion";

const ASPECT = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

interface ArtworkCardProps {
  src: string;
  /** Accessible name of the card. Describes the work and the resulting action. */
  label: string;
  onSelect: () => void;
  aspect?: keyof typeof ASPECT;
  sizes?: string;
  /** Extra classes on the outer wrapper, e.g. a grid column span. */
  className?: string;
  /** Content layered over the image, positioned by the caller. */
  overlay?: ReactNode;
  /** Static caption rendered below the frame, outside the card chrome. */
  footer?: ReactNode;
}

export default function ArtworkCard({
  src,
  label,
  onSelect,
  aspect = "portrait",
  sizes,
  className = "",
  overlay,
  footer,
}: ArtworkCardProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      <button
        type="button"
        onClick={onSelect}
        aria-label={label}
        data-gallery-item
        className="group relative block w-full overflow-hidden rounded-2xl border border-[color:var(--color-paper)]/20 bg-[color:var(--color-paper)]/40 shadow-sm backdrop-blur-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className={`relative w-full ${ASPECT[aspect]}`}>
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>
        {overlay}
      </button>
      {footer}
    </motion.div>
  );
}
