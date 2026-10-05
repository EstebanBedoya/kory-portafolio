import { timingSafeEqual } from "node:crypto";

import { requireEnv } from "@/lib/env";
import { getObrasOcultas } from "@/lib/content";

/**
 * Gate for the hidden gallery.
 *
 * The works are never part of the prerendered page: the client posts the
 * password here and only a match returns them. A shared password is a soft
 * gate, not account security — it keeps the gallery out of casual view, which
 * is all the artist asked for.
 */
export const dynamic = "force-dynamic";

function matches(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? (body as { password: unknown }).password
      : null;

  if (
    typeof password !== "string" ||
    !matches(password, requireEnv("GALERIA_OCULTA_PASSWORD"))
  ) {
    return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  return Response.json({ obras: await getObrasOcultas() });
}
