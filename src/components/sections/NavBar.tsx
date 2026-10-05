"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MENU, NAV_PRINCIPAL } from "@/lib/menu";

const LINK_FOCUS =
  "rounded-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Home sections are anchors; from any other page they go through the home.
  const resolve = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  const isActive = (href: string) => href === pathname;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-500 ${
          scrolled || isOpen ? "bg-[color:var(--color-paper)]/10 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="relative z-50 rounded-sm mix-blend-multiply focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image
            src="/logo-name.png"
            alt="Kory"
            width={120}
            height={40}
            className="h-auto w-auto"
          />
        </Link>

        <div className="relative z-50 flex items-center gap-8">
          {/* Main pages */}
          <div className="hidden gap-8 text-eyebrow uppercase tracking-meta text-neutral-dark md:flex">
            {NAV_PRINCIPAL.map((link) => (
              <Link
                key={link.name}
                href={resolve(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`${LINK_FOCUS} hover:text-brand aria-[current=page]:text-brand`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Hamburger: the whole site map */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-sm p-3 text-neutral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Menú"
            aria-expanded={isOpen}
            aria-controls="site-menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-neutral-dark block rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-neutral-dark block rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-neutral-dark block rounded-full"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[color:var(--color-paper)]/95 backdrop-blur-xl"
          >
            <ul className="mx-auto flex min-h-full max-w-reading flex-col justify-center gap-6 px-6 pb-12 pt-28 md:px-12">
              {MENU.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={resolve(item.href)}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`${LINK_FOCUS} font-serif text-title ${
                      item.locked
                        ? "text-red-700 hover:text-red-900"
                        : "text-neutral-dark hover:text-brand aria-[current=page]:text-brand"
                    }`}
                  >
                    {item.name}
                    {item.locked && (
                      <span aria-hidden="true" className="ml-3 text-body">
                        🔒
                      </span>
                    )}
                  </Link>

                  {item.children && (
                    <ul className="mt-3 flex flex-col gap-2 border-l border-brand/20 pl-5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={resolve(child.href)}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive(child.href) ? "page" : undefined}
                            className={`${LINK_FOCUS} text-eyebrow uppercase tracking-meta text-neutral-dark hover:text-brand aria-[current=page]:text-brand`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
