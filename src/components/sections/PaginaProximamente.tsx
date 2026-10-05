import ScrollReveal from "@/components/ui/ScrollReveal";

/** Placeholder page for a menu entry whose content is not defined yet. */
export default function PaginaProximamente({ titulo }: { titulo: string }) {
  return (
    <section className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <ScrollReveal>
          <h1 className="font-serif text-title text-neutral-dark">{titulo}</h1>
          <p className="mt-3 text-meta uppercase tracking-meta text-neutral-dark/70">
            Próximamente
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
