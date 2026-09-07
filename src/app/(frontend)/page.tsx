import HeroCelestial from "@/components/sections/HeroCelestial";
import AboutCelestial from "@/components/sections/AboutCelestial";
import GalleryFloating from "@/components/sections/GalleryFloating";
import ProjectGallery from "@/components/sections/ProjectGallery";
import ContactoCelestial from "@/components/sections/ContactoCelestial";
import { getObras, getProyectos } from "@/lib/content";

/**
 * Prerendered, with a daily rebuild as a backstop. The real mechanism is
 * on-demand invalidation from the CMS — see src/hooks/revalidatePortafolio.ts
 * — which is what keeps these database queries out of the request path.
 */
export const revalidate = 86400;

export default async function HomePage() {
  const [obras, proyectos] = await Promise.all([getObras(), getProyectos()]);

  return (
    <main>
      <HeroCelestial />
      <AboutCelestial />
      <GalleryFloating obras={obras} />
      {proyectos.map((proyecto) => (
        <ProjectGallery key={proyecto.id} proyecto={proyecto} />
      ))}
      <ContactoCelestial />
    </main>
  );
}
