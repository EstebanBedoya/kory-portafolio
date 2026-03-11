import HeroCelestial from "@/components/sections/HeroCelestial";
import AboutCelestial from "@/components/sections/AboutCelestial";
import GalleryFloating from "@/components/sections/GalleryFloating";
import ContactoCelestial from "@/components/sections/ContactoCelestial";

export default function HomePage() {
  return (
    <main>
      <HeroCelestial />
      <AboutCelestial />
      <GalleryFloating />
      <ContactoCelestial />
    </main>
  );
}
