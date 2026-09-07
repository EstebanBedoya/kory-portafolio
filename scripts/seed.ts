/**
 * Moves the hardcoded portfolio content into Payload.
 *
 * Run locally, not in CI: it needs the original JPEGs on disk, and going
 * through the Local API means uploads are not subject to the request body
 * limit that constrains the browser path.
 *
 *   npm run seed
 *   npm run seed -- --force     # re-seed a database that already has content
 *
 * Ordering is preserved by creating records in source order, which is what
 * the gallery's manual `_order` is initialised from.
 */

import path from "path";
import { fileURLToPath } from "url";

import config from "@payload-config";
import { getPayload } from "payload";

import { obras } from "../src/data/obras";
import { proyectos } from "../src/data/proyectos";
import { textos } from "../src/data/textos";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "..", "public");

/**
 * Tells the collection hooks to skip revalidation: they call revalidatePath,
 * which only exists inside a Next.js request, and there is nothing to
 * invalidate while seeding anyway.
 *
 * A function, not a shared constant, and that matters. Payload writes its own
 * per-operation state into `req.context`, so handing the same object to every
 * create leaks state between them — the second upload sees the first one's
 * bookkeeping, concludes the file is already handled, and silently skips
 * sending it to storage. The records still come out looking correct, so the
 * damage only shows up as broken images on the site.
 */
const seedContext = () => ({ disableRevalidate: true });

/** Resolves a `/images/...` path from the old data files to a real file. */
function assetPath(publicPath: string): string {
  return path.join(publicDir, publicPath.replace(/^\//, ""));
}

async function main() {
  const force = process.argv.includes("--force");
  const payload = await getPayload({ config });

  const existing = await payload.count({ collection: "obras" });
  if (existing.totalDocs > 0 && !force) {
    throw new Error(
      `Refusing to seed: 'obras' already holds ${existing.totalDocs} record(s). ` +
        `Re-run with --force if duplicating them is what you want.`,
    );
  }

  // --- Admin account -------------------------------------------------------
  // Created through the Local API, which runs with overrideAccess: true and so
  // is not blocked by the closed `create` rule on Users.
  const users = await payload.count({ collection: "users" });
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "No users exist and SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD are not set. " +
          "Without them the admin panel would have no way in.",
      );
    }
    await payload.create({
      collection: "users",
      data: { email, password },
      context: seedContext(),
    });
    console.log(`✓ admin account created for ${email}`);
  } else {
    console.log(`· ${users.totalDocs} user(s) already present, leaving them alone`);
  }

  // --- Textos del sitio ----------------------------------------------------
  // A global has exactly one record, so this overwrites rather than appends.
  // Only written when it is still empty: re-running the seed must not undo
  // copy the artist has since edited.
  //
  // The emptiness check uses the artist's statement, which is the one field
  // with no defaultValue. findGlobal happily returns the configured defaults
  // for a global that has never been saved, so testing any defaulted field
  // would report content that is not actually in the database.
  const textosActuales = await payload.findGlobal({ slug: "textos", depth: 0 });
  if (!textosActuales?.acercaDeclaracion) {
    await payload.updateGlobal({
      slug: "textos",
      data: textos,
      context: seedContext(),
    });
    console.log("✓ site copy");
  } else {
    console.log("· site copy already present, leaving it alone");
  }

  // --- Obras ---------------------------------------------------------------
  for (const obra of obras) {
    const media = await payload.create({
      collection: "media",
      filePath: assetPath(obra.imagen),
      data: {},
      context: seedContext(),
    });

    await payload.create({
      collection: "obras",
      data: {
        slug: obra.id,
        titulo: obra.titulo,
        anio: obra.anio,
        tecnica: obra.tecnica,
        tamano: obra.tamano,
        imagen: media.id,
      },
      context: seedContext(),
    });
    console.log(`✓ obra ${obra.id}`);
  }

  // --- Proyectos -----------------------------------------------------------
  for (const proyecto of proyectos) {
    const imagenes: { imagen: number; alt: string; wide: boolean }[] = [];

    for (const imagen of proyecto.imagenes) {
      const media = await payload.create({
        collection: "media",
        filePath: assetPath(imagen.src),
        data: {},
        context: seedContext(),
      });
      imagenes.push({
        imagen: media.id,
        alt: imagen.alt,
        wide: Boolean(imagen.wide),
      });
    }

    await payload.create({
      collection: "proyectos",
      data: {
        slug: proyecto.id,
        titulo: proyecto.titulo,
        anio: proyecto.anio,
        autor: proyecto.autor,
        dimensiones: proyecto.dimensiones,
        tecnica: proyecto.tecnica,
        introduccion: proyecto.introduccion.map((bloque) => ({
          tipo: bloque.tipo,
          texto: bloque.texto,
        })),
        imagenes,
      },
      context: seedContext(),
    });
    console.log(`✓ proyecto ${proyecto.id} (${imagenes.length} imágenes)`);
  }

  const [finalObras, finalProyectos, finalMedia] = await Promise.all([
    payload.count({ collection: "obras" }),
    payload.count({ collection: "proyectos" }),
    payload.count({ collection: "media" }),
  ]);

  console.log(
    `\nDone — ${finalObras.totalDocs} obras, ${finalProyectos.totalDocs} proyectos, ${finalMedia.totalDocs} media.`,
  );
}

// Payload keeps its database pool open, so the process needs an explicit
// exit once the work is done and awaited.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
