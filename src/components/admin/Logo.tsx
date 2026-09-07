/**
 * Replaces Payload's wordmark on the admin login screen.
 *
 * Styled inline rather than with Tailwind: the admin lives in its own route
 * group and deliberately does not load the site's stylesheet, which is what
 * keeps the portfolio's design from leaking into the CMS chrome.
 *
 * A plain <img> rather than next/image — this renders inside Payload's own
 * layout, where the optimiser buys nothing for a small static asset.
 */
export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- deliberate, see above
    <img
      src="/logo-name.png"
      alt="Kory"
      width={260}
      height={99}
      style={{ height: "auto", maxWidth: "100%" }}
    />
  );
}

export default Logo;
