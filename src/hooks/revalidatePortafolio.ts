import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

/**
 * Drops the cached portfolio pages after the artist publishes a change.
 *
 * The public site is statically generated, which is what keeps the database
 * out of the per-request path. On-demand revalidation is what makes that
 * tradeoff acceptable: an edit shows up without waiting for a rebuild.
 *
 * `'layout'` rather than `'page'` because the nav is built from the projects
 * list in the layout segment. Revalidating only the page would leave a
 * renamed project stale in the nav.
 */
function revalidatePortafolio(context: { disableRevalidate?: unknown }): void {
  // The seed script drives Payload outside a Next.js request, where
  // revalidatePath has no cache to talk to and throws.
  if (context?.disableRevalidate) return;

  // Writes during a production build have nothing to invalidate yet.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  try {
    revalidatePath("/", "layout");
  } catch (error) {
    // Never let a cache call fail the artist's save. A stale page is a far
    // smaller problem than a lost edit.
    console.error("[revalidate] failed to revalidate the portfolio:", error);
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  doc,
  req,
}) => {
  revalidatePortafolio(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
}) => {
  revalidatePortafolio(req.context);
  return doc;
};
