import HeroCelestial from "@/components/sections/HeroCelestial";
import AboutCelestial from "@/components/sections/AboutCelestial";
import GalleryFloating from "@/components/sections/GalleryFloating";
import ProjectGallery from "@/components/sections/ProjectGallery";
import ContactoCelestial from "@/components/sections/ContactoCelestial";
import { proyectos } from "@/data/proyectos";

export default function HomePage() {
  return (
    <main>
      <HeroCelestial />
      <AboutCelestial />
      <GalleryFloating />
      {proyectos.map((proyecto) => (
        <ProjectGallery key={proyecto.id} proyecto={proyecto} />
      ))}
      <ContactoCelestial />
    </main>
  );
}
