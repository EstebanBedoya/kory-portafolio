import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "textos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'El arte de' NOT NULL,
  	"hero_titulo_destacado" varchar DEFAULT 'recordar' NOT NULL,
  	"hero_bajada" varchar DEFAULT 'Donde la memoria se vuelve materia' NOT NULL,
  	"hero_firma" varchar DEFAULT 'Estefanía Bedoya Giraldo' NOT NULL,
  	"acerca_eyebrow" varchar DEFAULT 'Acerca de mí' NOT NULL,
  	"acerca_declaracion" varchar NOT NULL,
  	"acerca_lugar" varchar DEFAULT 'Medellín, Colombia' NOT NULL,
  	"acerca_anio" varchar DEFAULT '2003' NOT NULL,
  	"galeria_eyebrow" varchar DEFAULT 'Portafolio' NOT NULL,
  	"galeria_titulo" varchar DEFAULT 'Galería Celestial' NOT NULL,
  	"contacto_eyebrow" varchar DEFAULT 'Contacto' NOT NULL,
  	"contacto_email" varchar NOT NULL,
  	"contacto_instagram" varchar NOT NULL,
  	"contacto_copyright" varchar DEFAULT 'Estefanía Bedoya Giraldo © 2026' NOT NULL,
  	"meta_titulo" varchar DEFAULT 'KORY' NOT NULL,
  	"meta_descripcion" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "textos" CASCADE;`)
}
