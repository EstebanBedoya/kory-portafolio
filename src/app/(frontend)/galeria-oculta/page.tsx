import GaleriaOculta from "@/components/sections/GaleriaOculta";

export const metadata = { title: "Galería oculta" };

export default function GaleriaOcultaPage() {
  return (
    <main className="px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell pt-section">
        <GaleriaOculta />
      </div>
    </main>
  );
}
