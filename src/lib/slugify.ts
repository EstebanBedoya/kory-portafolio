/**
 * Turns a title into a URL-safe slug.
 *
 * Diacritics are stripped rather than dropped, so "Lirios azules" and
 * "Entre migas y recuerdos" keep their words intact. The slug is used as the
 * in-page anchor for a section, so it has to survive being put after a `#`.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
