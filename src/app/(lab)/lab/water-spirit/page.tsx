import type { Metadata } from 'next';
import WaterSpiritStage from './WaterSpiritStage';

// Internal QC harness for the 3D model pipeline, unrelated to the portfolio
// product — keep it out of search results while it stays in the app.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type SearchParams = Record<string, string | string[] | undefined>;

function num(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function WaterSpiritPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const mode = rawMode === 'neutral' || rawMode === 'grazing' ? rawMode : 'reference';

  return (
    <main
      style={{
        margin: 0,
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#ffffff',
      }}
    >
      <WaterSpiritStage
        azimuthDeg={num(params.az, 0)}
        elevationDeg={num(params.el, 0)}
        mode={mode}
        still={params.still !== '0'}
        flat={params.flat === '1'}
        width={num(params.w, 744)}
        height={num(params.h, 984)}
      />
    </main>
  );
}
