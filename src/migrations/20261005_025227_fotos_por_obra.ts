import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "obras_imagenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL,
  	"alt" varchar
  );
  
  ALTER TABLE "obras" DROP CONSTRAINT "obras_imagen_id_media_id_fk";
  
  DROP INDEX "obras_imagen_idx";
  ALTER TABLE "obras_imagenes" ADD CONSTRAINT "obras_imagenes_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "obras_imagenes" ADD CONSTRAINT "obras_imagenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."obras"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "obras_imagenes_order_idx" ON "obras_imagenes" USING btree ("_order");
  CREATE INDEX "obras_imagenes_parent_id_idx" ON "obras_imagenes" USING btree ("_parent_id");
  CREATE INDEX "obras_imagenes_imagen_idx" ON "obras_imagenes" USING btree ("imagen_id");
  INSERT INTO "obras_imagenes" ("_order", "_parent_id", "id", "imagen_id")
  SELECT 1, "id", md5(random()::text || "id"::text), "imagen_id" FROM "obras" WHERE "imagen_id" IS NOT NULL;
  ALTER TABLE "obras" DROP COLUMN "imagen_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "obras" ADD COLUMN "imagen_id" integer;
  UPDATE "obras" SET "imagen_id" = (
    SELECT "imagen_id" FROM "obras_imagenes" WHERE "_parent_id" = "obras"."id" ORDER BY "_order" LIMIT 1
  );
  ALTER TABLE "obras" ALTER COLUMN "imagen_id" SET NOT NULL;
  ALTER TABLE "obras_imagenes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "obras_imagenes" CASCADE;
  ALTER TABLE "obras" ADD CONSTRAINT "obras_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "obras_imagen_idx" ON "obras" USING btree ("imagen_id");`)
}
