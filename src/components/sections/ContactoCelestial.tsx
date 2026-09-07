"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactoCelestial() {
  return (
    <section id="contact" className="px-6 py-section-lg md:px-12 lg:px-24">
      <div className="mx-auto max-w-reading text-center">
        <SectionHeading eyebrow="Contacto" align="center" className="mb-12" />

        <div className="space-y-12">
          <ScrollReveal delay={0.1}>
            <a href="mailto:estefabegi@gmail.com" className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <span className="mb-3 block text-meta uppercase tracking-meta text-neutral-dark/70">
                Email
              </span>
              <span className="font-serif text-title text-neutral-dark transition-colors duration-300 group-hover:text-brand">
                estefabegi@gmail.com
              </span>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <a
              href="https://www.instagram.com/its_koryn"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="mb-3 block text-meta uppercase tracking-meta text-neutral-dark/70">
                Instagram
              </span>
              <span className="font-serif text-title text-neutral-dark transition-colors duration-300 group-hover:text-brand">
                @its_koryn
              </span>
            </a>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-24 pt-12 border-t border-neutral-dark/10">
            <p className="text-meta uppercase tracking-meta text-neutral-dark/70">
              Estefanía Bedoya Giraldo © 2026
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
