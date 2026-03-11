"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex justify-between items-center"
    >
      <Link href="/" className="mix-blend-multiply">
        <Image
          src="/logo-name.png"
          alt="Kory"
          width={120}
          height={40}
          className="h-auto w-auto"
        />
      </Link>

      <div className="flex gap-8 text-xs uppercase tracking-[0.2em] text-neutral-dark">
        <Link 
          href="#about" 
          className="hover:text-brand transition-colors duration-300"
        >
          Acerca
        </Link>
        <Link 
          href="#gallery" 
          className="hover:text-brand transition-colors duration-300"
        >
          Galería
        </Link>
        <Link 
          href="#contact" 
          className="hover:text-brand transition-colors duration-300"
        >
          Contacto
        </Link>
      </div>
    </motion.nav>
  );
}
