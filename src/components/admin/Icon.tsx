/**
 * Replaces Payload's mark in the admin navigation header.
 *
 * Uses the silhouette rather than the wordmark: this slot is small and
 * roughly square, where a wide wordmark would shrink to illegibility.
 */
export function Icon() {
  return (
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
