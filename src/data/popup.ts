/**
 * The Popup section: a making-of of the pop-up card series, shown as slides.
 *
 * Kept out of content.json on purpose — `scripts/export-static.mjs` rewrites
 * that file from the CMS and would wipe it. Text comes from the project's two
 * PDFs (proposal and progress), so nothing here links out to a document.
 */

export interface PopupDiapositiva {
  /** "Propuesta" or "Avance"; groups the slides and tints the label. */
  fase: "Propuesta" | "Avance";
  /** Short label above the title, e.g. "Mecanismos". */
  etiqueta: string;
  titulo: string;
  texto: string;
  /** Bulleted lines, used by the text-only slides. */
  lista?: string[];
  src?: string;
  video?: string;
  alt?: string;
}

export const popup = {
  eyebrow: "Obra en proceso",
  titulo: "Popup",
  bajada:
    "Tarjetas pop-up interactivas: cinco piezas de papel que despliegan en 3D la comida favorita de personas cercanas. Esto es todo el trabajo hecho hasta ahora.",
  diapositivas: [
    {
      fase: "Propuesta",
      etiqueta: "Concepto",
      titulo: "Tarjetas pop-up interactivas",
      texto:
        "Un proyecto de ingeniería de papel que une creatividad tridimensional, dinamismo mecánico y significado emocional.",
      lista: [
        "El reto: las tarjetas convencionales son objetos planos y pasivos, y su falta de interactividad resta impacto y sorpresa.",
        "La solución: mecanismos sencillos de plegado que vuelven la tarjeta una pieza tridimensional centrada en lo afectivo.",
      ],
    },
    {
      fase: "Propuesta",
      etiqueta: "Alcance",
      titulo: "Cinco tarjetas, cinco comidas favoritas",
      texto:
        "Una serie de tarjetas artesanales tipo regalo, cada una con el platillo preferido de alguien cercano.",
      lista: [
        "Tarjeta 01 · Arroz de verduras · pliegue en V",
        "Tarjeta 02 · Hamburguesa · pliegue en V",
        "Tarjeta 03 · Pastas · lengüeta móvil",
        "Tarjeta 04 · Chicharrones · pliegue en V",
        "Tarjeta 05 · Cazuela de mariscos · doble pliegue en V",
      ],
    },
    {
      fase: "Propuesta",
      etiqueta: "Mecanismos",
      titulo: "Tres mecanismos de papel",
      texto: "Simples pero versátiles, para que cada tarjeta se arme distinto.",
      lista: [
        "Pliegue en V: eleva una figura al abrir la tarjeta a 90° o 180°.",
        "Paralelogramos: pestañas paralelas que crean varios niveles de profundidad.",
        "Lengüeta / slider: una pieza móvil que el usuario desliza o rota.",
      ],
    },
    {
      fase: "Propuesta",
      etiqueta: "Materiales",
      titulo: "Materiales y técnica",
      texto: "Cada decisión busca pliegues limpios y una tarjeta que resista abrirse muchas veces.",
      lista: [
        "Cartulina de soporte de 220–300 g/m² para la base exterior.",
        "Elementos interiores de 160–200 g/m², sin abultamientos ni fisuras.",
        "Adhesivo libre de ácido, que no deforma el papel.",
        "Hendido e incisión antes del troquelado para articulaciones precisas.",
      ],
    },
    {
      fase: "Propuesta",
      etiqueta: "Cronograma",
      titulo: "Cuatro etapas de ejecución",
      texto: "De la idea a la presentación final del proyecto.",
      lista: [
        "Etapa 1 · Personajes, encuestas de platillos y primeros bocetos.",
        "Etapa 2 · Maquetas de prueba para validar los mecanismos.",
        "Etapa 3 · Ilustración, corte de piezas y ensamble de las cinco tarjetas.",
        "Etapa 4 · Pruebas de apertura y cierre, y presentación.",
      ],
    },
    {
      fase: "Avance",
      etiqueta: "Bocetaje",
      titulo: "Primer boceto y color",
      texto:
        "Tarjeta 01, arroz de verduras: el plato rodeado de sus ingredientes —tomate, zanahoria, arvejas, cebolla y limón— sobre un fondo de marcador.",
      src: "/content/proceso/01-boceto-color.jpg",
      alt: "Boceto en marcador y acuarela de un plato de arroz de verduras rodeado de tomates, zanahorias, arvejas, cebolla, pimentón y limones.",
    },
    {
      fase: "Avance",
      etiqueta: "Prototipo",
      titulo: "Primera prueba de pop-up",
      texto:
        "Prueba mecánica con una pasta de farfalle, pesto, tomate picado y jamón serrano: cada ingrediente ilustrado, recortado y rotulado se eleva en un nivel distinto del pliegue en V.",
      src: "/content/proceso/02-prueba-popup-pasta.jpg",
      alt: "Tarjeta pop-up abierta con ilustraciones recortadas de queso crema, pesto, farfalle, tomate picado, un plato de pasta y jamón serrano en distintos niveles.",
    },
    {
      fase: "Avance",
      etiqueta: "Collage",
      titulo: "Collage de los laterales",
      texto:
        "Pensar todas las caras del mecanismo: los laterales se resuelven con mantel a cuadros y madera para que la tarjeta se vea completa.",
      src: "/content/proceso/03-collage-laterales.jpg",
      alt: "Plantilla de collage con textura de mantel a cuadros vinotinto y madera, y un marco de papel calado con la lista de ingredientes escrita a mano.",
    },
    {
      fase: "Avance",
      etiqueta: "Diagramación",
      titulo: "Ficha de la tarjeta",
      texto:
        "Composición de la ficha: papel calado, zanahorias y cilantro enmarcan el título «Arroz de verduras».",
      src: "/content/proceso/04-ficha-portada.jpg",
      alt: "Ficha de papel calado con el título Arroz de verduras escrito a mano y rodajas de zanahoria con cilantro en dos esquinas.",
    },
    {
      fase: "Avance",
      etiqueta: "Montaje",
      titulo: "Ensamblaje y collage",
      texto:
        "Las ilustraciones a mano de cada ingrediente se integran sobre la base de texturas, simulando la tarjeta terminada.",
      src: "/content/proceso/05-ensamblaje-a.jpg",
      alt: "Tarjeta pop-up abierta de arroz de verduras con un plato, tomates, cebolla, pimentón, zanahorias, arvejas y limón recortados sobre una base de texturas.",
    },
    {
      fase: "Avance",
      etiqueta: "Montaje",
      titulo: "Prueba final del ensamblaje",
      texto:
        "Segunda toma de la prueba final: se revisa que los niveles se ordenen y las piezas queden alineadas al abrir.",
      src: "/content/proceso/06-ensamblaje-b.jpg",
      alt: "Segunda vista de la tarjeta pop-up de arroz de verduras armada sobre cartulina, con los ingredientes recortados en distintos niveles.",
    },
    {
      fase: "Avance",
      etiqueta: "Registro",
      titulo: "Video del montaje",
      texto: "Registro en video del avance del montaje de la tarjeta.",
      video: "/content/proceso/07-montaje.mp4",
      alt: "Video del montaje de la tarjeta pop-up.",
    },
  ] satisfies PopupDiapositiva[],
};
