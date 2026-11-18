/**
 * Snapshots the published portfolio into the repo so it runs with no database
 * and no object storage.
 *
 *   node scripts/export-static.mjs [https://koryns.online]
 *
 * Writes src/data/content.json and downloads every image into
 * public/content/. Only public works are exported; the hidden gallery stays
 * behind its password in the live site.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = (process.argv[2] ?? "https://koryns.online").replace(/\/$/, "");
const root = path.resolve(import.meta.dirname, "..");
const imgDir = path.join(root, "public", "content");

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
};

const { docs } = await (
  await get(`${origin}/api/obras?limit=200&depth=2&sort=_order`)
).json();
const textos = await (await get(`${origin}/api/globals/textos?depth=0`)).json();

await mkdir(imgDir, { recursive: true });

const saved = new Map();
async function download(url) {
  const name = path.basename(new URL(url).pathname);
  if (!saved.has(name)) {
    const buf = Buffer.from(await (await get(url)).arrayBuffer());
    await writeFile(path.join(imgDir, name), buf);
    saved.set(name, true);
  }
  return `/content/${name}`;
}

const obras = [];
for (const doc of docs) {
  const imagenes = [];
  for (const row of doc.imagenes ?? []) {
    const m = row.imagen;
    const url = m?.sizes?.web?.url ?? m?.url;
    if (!url) continue;
    imagenes.push({ src: await download(url), alt: row.alt || doc.titulo });
  }
  if (!imagenes.length) continue;
  obras.push({
    id: doc.slug,
    titulo: doc.titulo,
    galeria: doc.galeria,
    anio: doc.anio,
    tecnica: doc.tecnica,
    tamano: doc.tamano,
    ...(doc.descripcion ? { descripcion: doc.descripcion } : {}),
    imagenes,
  });
}

const texto = (k) => textos[k] ?? "";
const content = {
  obras,
  textos: {
    hero: {
      titulo: texto("heroTitulo"),
      tituloDestacado: texto("heroTituloDestacado"),
      bajada: texto("heroBajada"),
      firma: texto("heroFirma"),
    },
    acerca: {
      eyebrow: texto("acercaEyebrow"),
      parrafos: texto("acercaDeclaracion")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      lugar: texto("acercaLugar"),
      anio: texto("acercaAnio"),
    },
    galeria: { eyebrow: texto("galeriaEyebrow"), titulo: texto("galeriaTitulo") },
    contacto: {
      eyebrow: texto("contactoEyebrow"),
      email: texto("contactoEmail"),
      instagram: texto("contactoInstagram").replace(/^@/, ""),
      copyright: texto("contactoCopyright"),
    },
    meta: { titulo: texto("metaTitulo"), descripcion: texto("metaDescripcion") },
  },
};

await writeFile(
  path.join(root, "src", "data", "content.json"),
  JSON.stringify(content, null, 2) + "\n",
);
console.log(`✓ ${obras.length} obras, ${saved.size} imágenes`);
