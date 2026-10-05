import HeroCelestial from "@/components/sections/HeroCelestial";
import AboutCelestial from "@/components/sections/AboutCelestial";
import Galerias from "@/components/sections/Galerias";
import Popup from "@/components/sections/Popup";
import MasSecciones from "@/components/sections/MasSecciones";
import ContactoCelestial from "@/components/sections/ContactoCelestial";
import { getObras, getTextos } from "@/lib/content";

/**
 * Prerendered, with a daily rebuild as a backstop. The real mechanism is
 * on-demand invalidation from the CMS — see src/hooks/revalidatePortafolio.ts
 * — which is what keeps these database queries out of the request path.
 */
export const revalidate = 86400;

export default async function HomePage() {
  const [obras, textos] = await Promise.all([
    getObras(),
    getTextos(),
  ]);

  return (
    <main>
      <HeroCelestial textos={textos.hero} />
      <Galerias obras={obras} textos={textos.galeria} />
      <Popup />
      <AboutCelestial textos={textos.acerca} />
      <MasSecciones />
      <ContactoCelestial textos={textos.contacto} />
    </main>
  );
}
