"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

type Align = "left" | "center" | "responsive";

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Optional display title. Omit for sections that only need the label. */
  title?: string;
  /** "responsive" centres on mobile and aligns left from the md breakpoint. */
  align?: Align;
  className?: string;
}

const TEXT_ALIGN: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  responsive: "text-center md:text-left",
};

const RULE_ALIGN: Record<Align, string> = {
  left: "",
  center: "mx-auto",
  responsive: "mx-auto md:mx-0",
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  // When there's no title, the eyebrow is the section's only label — promote
  // it to an <h2> (same styling) so the section still gets a real heading.
  const EyebrowTag = title ? "span" : "h2";

  return (
    <ScrollReveal className={className}>
      <div className={TEXT_ALIGN[align]}>
        <EyebrowTag className="block text-eyebrow font-medium uppercase tracking-eyebrow text-accent">
          {eyebrow}
        </EyebrowTag>

        {title && (
          <h2 className="mt-2 font-serif text-title text-neutral-dark">
            {title}
          </h2>
        )}

        <div className={`mt-4 h-px w-16 bg-brand/30 ${RULE_ALIGN[align]}`} />
      </div>
    </ScrollReveal>
  );
}
