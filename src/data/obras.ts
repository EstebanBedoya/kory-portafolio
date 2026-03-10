export interface Obra {
  id: string;
  titulo: string;
  anio: number;
  tecnica: string;
  tamano: string;
  imagen: string;
}

export const obras: Obra[] = [
  {
    id: "lirios-azules",
    titulo: "Lirios azules",
    anio: 2026,
    tecnica: "Óleo pastel sobre cartón industrial",
    tamano: "media carta",
    imagen: "/images/Imagenes portafolio/lirios-azules.jpg",
  },
  {
    id: "cascabel",
    titulo: "Cascabel",
    anio: 2025,
    tecnica: "Óleo pastel sobre papel acuarela",
    tamano: "carta",
    imagen: "/images/Imagenes portafolio/cascabel.jpg",
  },
  {
    id: "varang",
    titulo: "Varang",
    anio: 2025,
    tecnica: "Óleo pastel sobre papel acuarela",
    tamano: "carta",
    imagen: "/images/Imagenes portafolio/varang.jpg",
  },
  {
    id: "toronja",
    titulo: "Toronja",
    anio: 2025,
    tecnica: "Óleo pastel sobre papel acuarela",
    tamano: "carta",
    imagen: "/images/Imagenes portafolio/toronja.jpg",
  },
  {
    id: "odio",
    titulo: "Odio",
    anio: 2026,
    tecnica: "Óleo pastel sobre cartón industrial",
    tamano: "media carta",
    imagen: "/images/Imagenes portafolio/odio.jpg",
  },
  {
    id: "uvas",
    titulo: "Uvas",
    anio: 2025,
    tecnica: "Óleo pastel sobre papel acuarela",
    tamano: "media carta",
    imagen: "/images/Imagenes portafolio/uvas.jpg",
  },
];
