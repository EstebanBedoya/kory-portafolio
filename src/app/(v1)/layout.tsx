import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estefanía Bedoya Giraldo | Kory",
  description:
    "Portafolio artístico de Estefanía Bedoya Giraldo (Kory). Obras que exploran la memoria, la nostalgia y la materialidad desde una estética gótica y matérica.",
  keywords: [
    "arte",
    "portafolio",
    "pintura",
    "dibujo",
    "óleo pastel",
    "Kory",
    "Estefanía Bedoya Giraldo",
  ],
  authors: [{ name: "Estefanía Bedoya Giraldo" }],
  openGraph: {
    title: "Estefanía Bedoya Giraldo | Kory",
    description:
      "Portafolio artístico. El acto de recordar como construcción de identidad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-[#f5f5f5] antialiased">
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
