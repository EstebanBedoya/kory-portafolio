"use client";

import { motion } from "framer-motion";
import Section from "../ui/Section";

export default function Contacto() {
  return (
    <Section id="contacto" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-[#a0a0a0]">
            Contacto
          </span>
          <div className="w-16 h-px bg-[#a0a0a0]/30 mt-4 mx-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-8"
        >
          <a
            href="mailto:estefabegi@gmail.com"
            className="block group"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#808080] block mb-3">
              Email
            </span>
            <span className="font-serif text-3xl md:text-4xl text-[#f5f5f5] group-hover:text-[#d0d0d0] transition-colors">
              estefabegi@gmail.com
            </span>
          </a>

          <a
            href="https://instagram.com/_artkory"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#808080] block mb-3">
              Instagram
            </span>
            <span className="font-serif text-3xl md:text-4xl text-[#f5f5f5] group-hover:text-[#d0d0d0] transition-colors">
              @_artkory
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 pt-12 border-t border-[#1a1a1a]"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#606060]">
            Estefanía Bedoya Giraldo © 2026
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
