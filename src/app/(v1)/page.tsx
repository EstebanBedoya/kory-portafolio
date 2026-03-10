import Hero from "@/components/sections/Hero";
import SobreMi from "@/components/sections/SobreMi";
import Galeria from "@/components/sections/Galeria";
import Contacto from "@/components/sections/Contacto";

export default function Home() {
  return (
    <main>
      <Hero />
      <SobreMi />
      <Galeria />
      <Contacto />
    </main>
  );
}
