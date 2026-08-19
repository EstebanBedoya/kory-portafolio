export interface ProyectoParrafo {
  tipo: "parrafo" | "destacado";
  texto: string;
}

export interface ProyectoImagen {
  src: string;
  alt: string;
  /** Landscape shots span the full grid width so they are never cropped. */
  wide?: boolean;
}

export interface Proyecto {
  id: string;
  titulo: string;
  anio: number;
  autor: string;
  dimensiones: string;
  tecnica: string;
  introduccion: ProyectoParrafo[];
  imagenes: ProyectoImagen[];
}

export const proyectos: Proyecto[] = [
  {
    id: "entre-migas-y-recuerdos",
    titulo: "Entre migas y recuerdos",
    anio: 2026,
    autor: "Estefania Bedoya",
    dimensiones: "varias",
    tecnica: "Registro fotográfico, instalación y óleo pastel",
    introduccion: [
      {
        tipo: "parrafo",
        texto:
          "Este proyecto nace de la observación de esos momentos aparentemente pequeños que suceden alrededor de la comida.",
      },
      {
        tipo: "destacado",
        texto:
          "¿Por qué ciertos alimentos permanecen en la memoria emocional de las personas?",
      },
      {
        tipo: "parrafo",
        texto:
          "La respuesta comenzó a revelarse en conversaciones espontáneas, recuerdos familiares y reacciones inmediatas frente a comidas tradicionales como la empanada o el buñuelo. Las personas no elegían únicamente desde el gusto; elegían desde la experiencia. Cada decisión estaba acompañada por historias, preferencias heredadas, recuerdos de infancia o momentos compartidos con otros.",
      },
    ],
    imagenes: [
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/01-vista-general.jpeg",
        alt: "Vista general de la instalación: una mesa vestida de negro frente a una pared con retratos instantáneos de los participantes, flanqueada por dos óleos pastel enmarcados.",
        wide: true,
      },
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/02-empanada-oleo-pastel.jpeg",
        alt: "Óleo pastel de una empanada sobre papel, enmarcado en negro.",
      },
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/03-bunuelo-oleo-pastel.jpeg",
        alt: "Óleo pastel de un buñuelo sobre papel, enmarcado en negro.",
      },
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/04-mesa-ofrenda.jpeg",
        alt: "Vista cenital de la mesa: platos con buñuelos y empanadas, un bombillo encendido y las tarjetas ilustradas que se reparten a los asistentes.",
      },
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/05-escritura-de-recuerdos.jpeg",
        alt: "Unas manos escriben un recuerdo en una de las tarjetas mientras el resto del público rodea la mesa.",
      },
      {
        src: "/images/proyectos/entre-migas-y-recuerdos/06-publico-en-la-mesa.jpeg",
        alt: "El público reunido alrededor de la mesa, escogiendo tarjetas y compartiendo comida durante la activación de la obra.",
        wide: true,
      },
    ],
  },
];
