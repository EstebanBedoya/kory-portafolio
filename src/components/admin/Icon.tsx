/**
 * Replaces Payload's mark in the admin navigation header.
 *
 * Uses the silhouette rather than the wordmark: this slot is small and
 * roughly square, where a wide wordmark would shrink to illegibility.
 */
export function Icon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a 22px static
    // asset in CMS chrome has nothing to gain from the image optimiser.
    <img
      src="/logo-silueta.png"
      alt="Kory"
      width={22}
      height={35}
      style={{ height: "auto", width: 22 }}
    />
  );
}

export default Icon;
