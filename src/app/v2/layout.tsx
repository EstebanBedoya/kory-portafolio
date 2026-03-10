import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals-v2.css";
import CustomCursor from "@/components/ui/CustomCursor";
import NavBar from "@/components/sections-v2/NavBar";

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
  title: "Estefanía Bedoya Giraldo | Kory - Versión Celestial",
  description: "Portafolio artístico celestial. El arte de recordar donde la memoria se vuelve materia.",
};

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="v2">
        <div className="noise-overlay" />
        <CustomCursor />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
