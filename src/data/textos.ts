/**
 * The site copy as it was hardcoded in the section components, kept here as
 * the source for the one-time migration into Payload.
 *
 * Like obras.ts and proyectos.ts, this file is migration input only — nothing
 * in the app reads it. It can be deleted once production has been seeded.
 */
export const textos = {
  heroTitulo: "El arte de",
  heroTituloDestacado: "recordar",
  heroBajada: "Donde la memoria se vuelve materia",
  heroFirma: "Estefanía Bedoya Giraldo",

  acercaEyebrow: "Acerca de mí",
  acercaDeclaracion: `Mi obra está atravesada por los archivos de la memoria, la nostalgia y el acto de recordar como construcción de identidad. Me interesa cómo el recuerdo moldea lo que somos y cómo el olvido puede convertirse en una forma de pérdida.

Desde lo plástico, trabajo con elementos como los alimentos y las frutas, que me permiten investigar la materialidad, el color y su carga simbólica. Visualmente, mi estética se mueve entre lo gótico y lo matérico, combinando sensibilidad y oscuridad.

Busco generar contemplación: que el espectador no solo observe la obra, sino que sienta que es observado por ella.`,
  acercaLugar: "Medellín, Colombia",
  acercaAnio: "2003",

  galeriaEyebrow: "Portafolio",
  galeriaTitulo: "Galería Celestial",

  contactoEyebrow: "Contacto",
  contactoEmail: "estefabegi@gmail.com",
  contactoInstagram: "its_koryn",
  contactoCopyright: "Estefanía Bedoya Giraldo © 2026",

  metaTitulo: "KORY",
  metaDescripcion:
    "Portafolio artístico celestial. El arte de recordar donde la memoria se vuelve materia.",
} as const;
