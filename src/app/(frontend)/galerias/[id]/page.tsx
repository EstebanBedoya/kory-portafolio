import { notFound } from "next/navigation";
import GaleriaPagina from "@/components/sections/GaleriaPagina";
import { getObras, getTextos } from "@/lib/content";
import { GALERIAS } from "@/lib/menu";

/** Same caching story as the home page: on-demand invalidation from the CMS. */
export const revalidate = 86400;

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return GALERIAS.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const galeria = GALERIAS.find((g) => g.id === id);
  return { title: galeria?.nombre };
}

export default async function GaleriaPage({ params }: Props) {
  const { id } = await params;
  const galeria = GALERIAS.find((g) => g.id === id);
  if (!galeria) notFound();

  const [obras, textos] = await Promise.all([getObras(), getTextos()]);

  return (
    <main>
      <GaleriaPagina
        activa={galeria.id}
        obras={obras.filter((obra) => obra.galeria === galeria.id)}
        textos={textos.galeria}
      />
    </main>
  );
}
