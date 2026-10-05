import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_obras_galeria" AS ENUM('pincel-y-bocado', 'galeria-2', 'galeria-3', 'oculta');
  ALTER TABLE "obras" ADD COLUMN "galeria" "enum_obras_galeria" DEFAULT 'pincel-y-bocado' NOT NULL;
  CREATE INDEX "obras_galeria_idx" ON "obras" USING btree ("galeria");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "obras_galeria_idx";
  ALTER TABLE "obras" DROP COLUMN "galeria";
  DROP TYPE "public"."enum_obras_galeria";`)
}
