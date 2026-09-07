import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { getNavProyectos } from "@/lib/content";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KORY",
  description: "Portafolio artístico celestial. El arte de recordar donde la memoria se vuelve materia.",
  icons: {
    icon: "/logo-silueta.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The nav lists the projects, so this segment reads from the CMS. It stays
  // part of the static shell; only /admin queries per request.
  const proyectos = await getNavProyectos();

  return (
    <html lang="es" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <div className="noise-overlay" />
        <ParticlesBackground />
        <CustomCursor />
        <NavBar proyectos={proyectos} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
