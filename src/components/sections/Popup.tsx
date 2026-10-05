"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

/** Placeholder until the Popup content is defined. */
export default function Popup() {
  return (
    <section id="popup" className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <ScrollReveal>
          <h2 className="font-serif text-title text-neutral-dark">Popup</h2>
          <p className="mt-3 text-meta uppercase tracking-meta text-neutral-dark/70">
            Próximamente
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
