"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ContactoCelestial() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.4em] text-brand">
              Contacto
            </span>
            <div className="w-16 h-px bg-brand/30 mt-4 mx-auto" />
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          <ScrollReveal delay={0.1}>
            <a href="mailto:estefabegi@gmail.com" className="block group">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-dark/70 block mb-3">
                Email
              </span>
              <span className="font-serif text-3xl md:text-4xl text-neutral-dark group-hover:text-brand transition-colors duration-300">
                estefabegi@gmail.com
              </span>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <a
              href="https://www.instagram.com/its_koryn"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-dark/70 block mb-3">
                Instagram
              </span>
              <span className="font-serif text-3xl md:text-4xl text-neutral-dark group-hover:text-brand transition-colors duration-300">
                @its_koryn
              </span>
            </a>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-24 pt-12 border-t border-neutral-dark/10">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-dark/50">
              Estefanía Bedoya Giraldo © 2026
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
