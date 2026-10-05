import type { GaleriaId } from "@/types/content";

export type GaleriaPublica = Exclude<GaleriaId, "oculta">;

export const GALERIAS: { id: GaleriaPublica; nombre: string }[] = [
  { id: "pincel-y-bocado", nombre: "Pincel y Bocado" },
  { id: "galeria-2", nombre: "Galería 2" },
  { id: "galeria-3", nombre: "Galería 3" },
];

export interface MenuItem {
  name: string;
  /** A home section ("#popup") or a page ("/subasta"). */
  href: string;
  /** Drawn in red and marked as locked. */
  locked?: boolean;
  children?: { name: string; href: string }[];
}

/** The four sections of the home page, shown in the header. */
export const NAV_PRINCIPAL = [
  { name: "Galerías", href: "#galerias" },
  { name: "Popup", href: "#popup" },
  { name: "Bio + CV", href: "#about" },
  { name: "Contacto", href: "#contact" },
];

/** The full site map, shown in the hamburger menu. */
export const MENU: MenuItem[] = [
  {
    name: "Galería",
    href: "#galerias",
    children: [
      ...GALERIAS.map((g) => ({ name: g.nombre, href: `/galerias/${g.id}` })),
      { name: "Popup", href: "#popup" },
      { name: "Bio + CV", href: "#about" },
    ],
  },
  { name: "Galería oculta", href: "/galeria-oculta", locked: true },
  { name: "Kaoa grabado", href: "/kaoa-grabado" },
  { name: "K Alterno", href: "/k-alterno" },
  { name: "Ojo de Kory", href: "/ojo-de-kory" },
  { name: "Subasta", href: "/subasta" },
  { name: "Contacto", href: "#contact" },
];
