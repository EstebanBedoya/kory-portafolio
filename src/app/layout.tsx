import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <div className="noise-overlay" />
        <ParticlesBackground />
        <CustomCursor />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
