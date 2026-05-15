// Far background: sky gradient, sun haze, four overlapping hill silhouettes,
// the dirt path winding across the field, and a row of distant tiny trees.
//
// Pure dressing - no state, no interactions. Lives behind everything else.

import { PixelTree } from '../pixel/decor.jsx';

const DISTANT_TREES = [
  ['8%',  '47%', 2],
  ['14%', '46%', 2],
  ['19%', '48%', 2],
  ['38%', '46%', 2],
  ['44%', '47%', 2],
  ['62%', '46%', 2],
  ['69%', '47%', 2],
  ['82%', '46%', 2],
  ['88%', '47%', 2],
];

export default function SkyAndHills() {
  return (
    <>
      {/* sky gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #84caff 0%, #b9e2ff 45%, #d3f0e6 60%, transparent 60%)',
        }}
      />

      {/* sun haze */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '20%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,236,180,0.7) 0%, rgba(255,220,140,0.3) 40%, rgba(255,220,140,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* layered hills */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <path d="M0,470 Q200,420 400,450 T800,440 T1200,455 T1600,445 L1600,900 L0,900 Z" fill="#a0c8a8" opacity="0.7" />
        <path d="M0,520 Q200,440 400,490 T800,470 T1200,500 T1600,490 L1600,900 L0,900 Z" fill="#7fb96a" />
        <path d="M0,580 Q300,520 600,560 T1200,550 T1600,570 L1600,900 L0,900 Z" fill="#6aa552" />
        <path d="M0,640 Q200,610 500,635 T1100,620 T1600,640 L1600,900 L0,900 Z" fill="#588f43" />
      </svg>

      {/* tiny trees on the hills */}
      {DISTANT_TREES.map(([l, t, s], i) => (
        <div key={`dt-${i}`} style={{ position: 'absolute', left: l, top: t, opacity: 0.85 }}>
          <PixelTree scale={s} variant={i % 3} />
        </div>
      ))}

      {/* foreground grass - pixel-textured via repeating gradients */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '52%',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%),' +
            'repeating-linear-gradient(90deg, #6abe4a 0 6px, #5fb443 6px 12px),' +
            'repeating-linear-gradient(0deg, #6abe4a 0 6px, #4f9c34 6px 12px)',
          backgroundBlendMode: 'multiply, normal, normal',
        }}
      />

      {/* dirt path - main band, lighter inner band, sprinkled darker pebbles */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <path
          d="M-50,720 C 200,640 350,680 500,620 S 850,490 1000,560 S 1350,720 1700,620"
          stroke="#a67149" strokeWidth="60" fill="none" strokeLinecap="round"
        />
        <path
          d="M-50,720 C 200,640 350,680 500,620 S 850,490 1000,560 S 1350,720 1700,620"
          stroke="#bf8a5e" strokeWidth="44" fill="none" strokeLinecap="round"
        />
        {Array.from({ length: 28 }).map((_, i) => {
          const t = i / 27;
          const x = -50 + 1750 * t;
          const y = 720 - 200 * Math.sin(t * Math.PI * 1.4) + Math.sin(i) * 8;
          return <rect key={i} x={x} y={y} width="6" height="6" fill="#8a5a35" opacity="0.6" />;
        })}
      </svg>
    </>
  );
}
