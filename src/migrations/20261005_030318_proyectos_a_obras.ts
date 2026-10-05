import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "obras" ADD COLUMN "descripcion" varchar;

  -- Each project becomes a work in Pincel y Bocado, appended after the
  -- existing ones. Its intro paragraphs become the description; the
  -- author and the "wide" flag have no counterpart on a work and are dropped.
  WITH nuevas AS (
    INSERT INTO "obras" ("titulo", "slug", "galeria", "anio", "tecnica", "tamano", "descripcion", "_order")
    SELECT p."titulo", p."slug", 'pincel-y-bocado', p."anio", p."tecnica", p."dimensiones",
      (SELECT string_agg(i."texto", E'\n\n' ORDER BY i."_order") FROM "proyectos_introduccion" i WHERE i."_parent_id" = p."id"),
      COALESCE((SELECT max("_order") FROM "obras"), 'a0') || 'V'
    FROM "proyectos" p
    RETURNING "id", "slug"
  )
  INSERT INTO "obras_imagenes" ("_order", "_parent_id", "id", "imagen_id", "alt")
  SELECT pi."_order", n."id", md5(random()::text || pi."id"), pi."imagen_id", pi."alt"
  FROM nuevas n
  JOIN "proyectos" p ON p."slug" = n."slug"
  JOIN "proyectos_imagenes" pi ON pi."_parent_id" = p."id";

  ALTER TABLE "proyectos_introduccion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_imagenes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "proyectos_introduccion" CASCADE;
  DROP TABLE "proyectos_imagenes" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_proyectos_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_proyectos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "proyectos_id";
  DROP TYPE "public"."enum_proyectos_introduccion_tipo";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_proyectos_introduccion_tipo" AS ENUM('parrafo', 'destacado');
  CREATE TABLE "proyectos_introduccion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tipo" "enum_proyectos_introduccion_tipo" DEFAULT 'parrafo' NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_imagenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL,
  	"alt" varchar NOT NULL,
  	"wide" boolean DEFAULT false
  );
  
  CREATE TABLE "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"titulo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"anio" numeric NOT NULL,
  	"autor" varchar NOT NULL,
  	"dimensiones" varchar NOT NULL,
  	"tecnica" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "proyectos_id" integer;
  ALTER TABLE "proyectos_introduccion" ADD CONSTRAINT "proyectos_introduccion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_imagenes" ADD CONSTRAINT "proyectos_imagenes_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_imagenes" ADD CONSTRAINT "proyectos_imagenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "proyectos_introduccion_order_idx" ON "proyectos_introduccion" USING btree ("_order");
  CREATE INDEX "proyectos_introduccion_parent_id_idx" ON "proyectos_introduccion" USING btree ("_parent_id");
  CREATE INDEX "proyectos_imagenes_order_idx" ON "proyectos_imagenes" USING btree ("_order");
  CREATE INDEX "proyectos_imagenes_parent_id_idx" ON "proyectos_imagenes" USING btree ("_parent_id");
  CREATE INDEX "proyectos_imagenes_imagen_idx" ON "proyectos_imagenes" USING btree ("imagen_id");
  CREATE INDEX "proyectos__order_idx" ON "proyectos" USING btree ("_order");
  CREATE UNIQUE INDEX "proyectos_slug_idx" ON "proyectos" USING btree ("slug");
  CREATE INDEX "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  ALTER TABLE "obras" DROP COLUMN "descripcion";`)
}
