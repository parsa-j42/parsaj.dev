// The pond. Genuinely a lot of SVG happening in one place - banks, reflections,
// pebbles, lily pads, a cattail or two, a frog peeking out of the grass. The
// `wobble()` formula keeps the perimeter "hand-drawn" rather than perfectly
// elliptical; everything else hangs off that shape via the same clip path.
//
// Kept as one component on purpose - every layer is positioned relative to the
// pond's wobbly outline, so splitting it would mean threading the same numbers
// through several files for no real benefit.

import React from 'react';

// Wobble formula reused for every perimeter sample below. Tweak with care -
// the lily pads, reeds, and pebbles all assume the same shape.
const wobble = (a) =>
  1
  + Math.sin(a * 3 + 0.7) * 0.025
  + Math.sin(a * 5 + 1.3) * 0.018
  + Math.cos(a * 2)       * 0.022;

export default function Pond({ width = 320, height = 130 }) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width  / 2 - 8;
  const ry = height / 2 - 8;

  // Build the wobbly perimeter path once.
  const pondPath = React.useMemo(() => {
    const segs = 40;
    let d = '';
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const w = wobble(a);
      const x = cx + Math.cos(a) * rx * w;
      const y = cy + Math.sin(a) * ry * w;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    return d + 'Z';
  }, [cx, cy, rx, ry]);

  return (
    <svg
      width={width + 60}
      height={height + 30}
      viewBox={`${-30} ${-15} ${width + 60} ${height + 30}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="pondGrad" cx="50%" cy="42%" r="58%">
          <stop offset="0%"   stopColor="#a8c8b8" />
          <stop offset="45%"  stopColor="#6b9c93" />
          <stop offset="85%"  stopColor="#456f6e" />
          <stop offset="100%" stopColor="#34534f" />
        </radialGradient>
        <radialGradient id="pondHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="rgba(110, 175, 90, 0)" />
          <stop offset="55%"  stopColor="rgba(110, 175, 90, 0.0)" />
          <stop offset="75%"  stopColor="rgba(118, 178, 88, 0.45)" />
          <stop offset="100%" stopColor="rgba(110, 170, 84, 0)" />
        </radialGradient>
        <radialGradient id="pondBank" cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
          <stop offset="88%"  stopColor="rgba(60, 80, 50, 0)" />
          <stop offset="95%"  stopColor="rgba(70, 90, 55, 0.6)" />
          <stop offset="100%" stopColor="rgba(70, 90, 55, 0)" />
        </radialGradient>
        <linearGradient id="pondReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(60, 110, 70, 0.35)" />
          <stop offset="40%"  stopColor="rgba(60, 110, 70, 0.10)" />
          <stop offset="100%" stopColor="rgba(60, 110, 70, 0)" />
        </linearGradient>
        <clipPath id="pondClip">
          <path d={pondPath} />
        </clipPath>
      </defs>

      {/* grassy halo + outer bank */}
      <ellipse cx={cx} cy={cy + 6} rx={rx + 44} ry={ry + 22} fill="url(#pondHalo)" />
      <ellipse cx={cx} cy={cy + 3} rx={rx + 12} ry={ry + 8}  fill="url(#pondBank)" />

      {/* water + sky reflection wash */}
      <path d={pondPath} fill="url(#pondGrad)" />
      <g clipPath="url(#pondClip)">
        <rect x={-30} y={-15} width={width + 60} height={height + 30} fill="url(#pondReflect)" />
      </g>

      {/* layered banks - six strokes, each a touch tighter than the last */}
      <path d={pondPath} fill="none" stroke="rgba(170, 150, 100, 0.18)" strokeWidth="20" strokeLinejoin="round" />
      <path d={pondPath} fill="none" stroke="rgba(178, 158, 110, 0.22)" strokeWidth="14" strokeLinejoin="round" transform="translate(-1, 0.5)" />
      <path d={pondPath} fill="none" stroke="rgba(150, 122, 80, 0.35)"  strokeWidth="9"  strokeLinejoin="round" transform="translate(1, 1)" />
      <path d={pondPath} fill="none" stroke="rgba(78, 60, 38, 0.55)"   strokeWidth="5"  strokeLinejoin="round" />
      <path d={pondPath} fill="none" stroke="rgba(54, 42, 26, 0.45)"   strokeWidth="2.6" strokeLinejoin="round" transform="translate(0, 0.6)" />
      <path d={pondPath} fill="none" stroke="rgba(36, 28, 16, 0.55)"   strokeWidth="1.6" strokeLinejoin="round" />

      {/* inner shadow + waterline highlights, both clipped to the pond */}
      <g clipPath="url(#pondClip)">
        <path d={pondPath} fill="none" stroke="rgba(80, 130, 130, 0.45)" strokeWidth="1.4" strokeLinejoin="round" transform="translate(0, 1.2)" />
      </g>
      <g clipPath="url(#pondClip)">
        <path d={pondPath} fill="none" stroke="rgba(15, 30, 30, 0.45)" strokeWidth="7"  strokeLinejoin="round" transform="translate(-1, -4)" />
        <path d={pondPath} fill="none" stroke="rgba(15, 30, 30, 0.25)" strokeWidth="12" strokeLinejoin="round" transform="translate(-1, -6)" />
      </g>

      {/* sparkle dashes - two passes with different rhythms */}
      <path d={pondPath} fill="none" stroke="rgba(240, 245, 220, 0.55)" strokeWidth="1.1" strokeDasharray="12 100 7 240 18 300" strokeDashoffset="-30" />
      <path d={pondPath} fill="none" stroke="rgba(220, 235, 200, 0.30)" strokeWidth="0.8" strokeDasharray="5 70 4 200" strokeDashoffset="-150" />

      {/* a little driftwood log on the bank */}
      {(() => {
        const a = Math.PI * 0.18;
        const w = wobble(a);
        const bx = cx + Math.cos(a) * (rx * w + 3);
        const by = cy + Math.sin(a) * (ry * w + 2);
        return (
          <g>
            <path d={`M${bx - 9},${by + 1} Q${bx - 6},${by - 3} ${bx - 2},${by - 2} Q${bx + 3},${by - 4} ${bx + 7},${by - 1} Q${bx + 9},${by + 2} ${bx + 6},${by + 4} Q${bx + 1},${by + 5} ${bx - 4},${by + 4} Q${bx - 8},${by + 3} ${bx - 9},${by + 1} Z`}
                  fill="rgba(70, 52, 32, 0.55)" />
            <path d={`M${bx - 6},${by} Q${bx - 3},${by - 2} ${bx},${by - 1} Q${bx + 3},${by - 2} ${bx + 5},${by + 1} Q${bx + 3},${by + 3} ${bx - 1},${by + 2} Q${bx - 5},${by + 2} ${bx - 6},${by} Z`}
                  fill="rgba(50, 36, 22, 0.6)" />
            <ellipse cx={bx - 3} cy={by + 1} rx="1"   ry="0.6" fill="#8a7860" />
            <ellipse cx={bx + 2} cy={by - 1} rx="0.8" ry="0.5" fill="#9c8a6e" />
          </g>
        );
      })()}

      {/* overhanging grass tufts - three positions around the rim */}
      {[0.22, 0.48, 0.78].map((t, i) => {
        const a = t * Math.PI * 2 + 0.04;
        const w = wobble(a);
        const px = cx + Math.cos(a) * (rx * w + 1);
        const py = cy + Math.sin(a) * (ry * w + 1);
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        const rot = (Math.atan2(ny, nx) * 180) / Math.PI + 90;
        return (
          <g key={'overhang-' + i}>
            <g clipPath="url(#pondClip)">
              <ellipse cx={px - nx * 2.5} cy={py - ny * 2.5} rx="4.5" ry="1.5"
                fill="rgba(20, 35, 32, 0.4)"
                transform={`rotate(${rot}, ${px}, ${py})`} />
            </g>
            <ellipse cx={px}     cy={py}     rx="5" ry="2"   fill="#3f7c2c" transform={`rotate(${rot}, ${px}, ${py})`} />
            <ellipse cx={px - 1} cy={py - 1} rx="3" ry="1.2" fill="#4f8c34" transform={`rotate(${rot}, ${px}, ${py})`} />
            {[-2, 0, 2, 3].map((dx, k) => (
              <path key={k}
                d={`M${px + dx},${py} Q${px + dx + 0.4},${py - 3} ${px + dx + 0.8},${py - 5 - (k % 2)}`}
                stroke={k % 2 ? '#4f8c34' : '#3f7c2c'} strokeWidth="1" fill="none" strokeLinecap="round" />
            ))}
          </g>
        );
      })}

      {/* pebbles around the perimeter */}
      {[0.05, 0.08, 0.11, 0.28, 0.31, 0.34, 0.52, 0.55,
        0.71, 0.74, 0.77, 0.80, 0.93, 0.96].map((t, i) => {
        const a = t * Math.PI * 2 + 0.18;
        const w = wobble(a);
        const off = 4 + ((i * 7) % 4);
        const px = cx + Math.cos(a) * (rx * w + off);
        const py = cy + Math.sin(a) * (ry * w + off * 0.7);
        const size = 1.5 + ((i * 5) % 3) * 0.7;
        const tone =
          i % 4 === 0 ? '#7a6a52'
          : i % 4 === 1 ? '#9c8a6e'
          : i % 4 === 2 ? '#5e5240'
          : '#b09878';
        return (
          <g key={'pb-' + i}>
            <ellipse cx={px + 0.3} cy={py + 0.5}     rx={size + 0.3} ry={size * 0.45} fill="rgba(0,0,0,0.25)" />
            <ellipse cx={px}       cy={py}           rx={size}       ry={size * 0.55} fill={tone} />
            <ellipse cx={px - size * 0.3} cy={py - size * 0.25} rx={size * 0.5} ry={size * 0.2} fill="rgba(255,255,255,0.25)" />
          </g>
        );
      })}

      {/* shore grass tufts (smaller, bushier) */}
      {[0.13, 0.21, 0.42, 0.58, 0.66, 0.87].map((t, i) => {
        const a = t * Math.PI * 2 + 0.05;
        const w = 1 + Math.sin(a * 3) * 0.025 + Math.cos(a * 2) * 0.022;
        const off = 6;
        const px = cx + Math.cos(a) * (rx * w + off);
        const py = cy + Math.sin(a) * (ry * w + off * 0.7);
        return (
          <g key={'tuft-' + i}>
            {[-2.5, 0, 2.5].map((dx, k) => {
              const tipX = px + dx * 0.6 + ((i + k) % 2 ? 0.7 : -0.7);
              const tipY = py - 5 - (k % 2 ? 1 : 0);
              return (
                <path key={k}
                  d={`M${px + dx},${py} Q${(px + dx + tipX) / 2},${py - 3} ${tipX},${tipY}`}
                  stroke={k === 1 ? '#4f8c34' : '#3f7c2c'}
                  strokeWidth="1" fill="none" strokeLinecap="round" />
              );
            })}
          </g>
        );
      })}

      {/* surface effects - streaks, expanding rings, sparkles - all clipped */}
      <g clipPath="url(#pondClip)">
        {Array.from({ length: 6 }).map((_, i) => {
          const y = cy - ry * 0.55 + i * (ry * 0.22);
          const w = (rx * 0.7) * (1 - Math.abs((i - 2.5) / 4));
          const sx = cx - w;
          const ex = cx + w;
          return (
            <path
              key={'ref-' + i}
              d={`M${sx},${y} Q${cx},${y - 1.2} ${ex},${y}`}
              stroke="rgba(230, 240, 220, 0.4)"
              strokeWidth="1"
              fill="none"
              style={{
                animation: `pondStreak ${5 + i * 0.6}s ease-in-out infinite`,
                animationDelay: `-${i * 0.7}s`,
                transformOrigin: `${cx}px ${y}px`,
              }}
            />
          );
        })}

        {[
          { x: 0.35, y: 0.42, d: 0 },
          { x: 0.62, y: 0.58, d: 2.5 },
          { x: 0.5,  y: 0.32, d: 5 },
        ].map((p, i) => {
          const epx = cx + (p.x - 0.5) * rx * 1.3;
          const epy = cy + (p.y - 0.5) * ry * 1.3;
          return (
            <ellipse
              key={'rp-' + i}
              cx={epx} cy={epy}
              rx="2" ry="0.8"
              fill="none"
              stroke="rgba(220, 235, 215, 0.55)" strokeWidth="1"
              style={{
                animation: 'pondEllipseRing 6s ease-out infinite',
                animationDelay: `-${p.d}s`,
                transformOrigin: `${epx}px ${epy}px`,
              }}
            />
          );
        })}

        {[
          { x: 0.32, y: 0.38 },
          { x: 0.62, y: 0.46 },
          { x: 0.48, y: 0.62 },
          { x: 0.74, y: 0.32 },
        ].map((p, i) => (
          <rect
            key={'sp-' + i}
            x={cx + (p.x - 0.5) * rx * 1.6 - 1}
            y={cy + (p.y - 0.5) * ry * 1.5 - 0.5}
            width="2" height="1"
            fill="rgba(255,255,255,0.55)"
            style={{
              animation: `pondSparkle ${4 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `-${i * 1.1}s`,
            }}
          />
        ))}
      </g>

      {/* lily pads */}
      <g transform={`translate(${cx - rx * 0.5}, ${cy + ry * 0.12})`}>
        <ellipse cx="2" cy="3" rx="14" ry="3"   fill="rgba(0,0,0,0.15)" />
        <ellipse cx="0" cy="0" rx="14" ry="8"   fill="#3d7c40" />
        <ellipse cx="0" cy="-1" rx="13" ry="6"  fill="#52a14d" />
        <path d="M-12,0 L0,-2 L0,2 Z" fill="#2a5a2a" />
        <rect x="-2" y="-8"  width="4" height="4" fill="#ff8fbe" />
        <rect x="-1" y="-10" width="2" height="2" fill="#ffd14a" />
      </g>
      <g transform={`translate(${cx + rx * 0.42}, ${cy - ry * 0.18})`}>
        <ellipse cx="2" cy="3" rx="11" ry="3"  fill="rgba(0,0,0,0.15)" />
        <ellipse cx="0" cy="0" rx="11" ry="6"  fill="#3d7c40" />
        <ellipse cx="0" cy="-1" rx="10" ry="4.5" fill="#52a14d" />
        <path d="M-9,0 L0,-2 L0,2 Z" fill="#2a5a2a" />
      </g>
      <g transform={`translate(${cx + rx * 0.05}, ${cy + ry * 0.42})`}>
        <ellipse cx="0" cy="0" rx="8" ry="4" fill="#3d7c40" />
        <ellipse cx="0" cy="-1" rx="7" ry="3" fill="#52a14d" />
        <path d="M-6,0 L0,-1 L0,1 Z" fill="#2a5a2a" />
      </g>

      {/* cattails / reeds around the rim */}
      {[
        { x: 0.06, y: 0.55, n: 5, lean: -1 },
        { x: 0.94, y: 0.6,  n: 4, lean:  1 },
        { x: 0.5,  y: 0.02, n: 6, lean:  0 },
        { x: 0.16, y: 0.96, n: 4, lean: -1 },
        { x: 0.82, y: 0.97, n: 5, lean:  1 },
        { x: 0.36, y: 0.98, n: 3, lean:  0 },
      ].map((r, i) => {
        const baseX = r.x * width;
        const baseY = r.y * height;
        return (
          <g key={'reed-' + i}>
            {Array.from({ length: r.n }).map((_, k) => {
              const ox = baseX + (k - r.n / 2) * 3 + (i % 2 ? 1 : -1);
              const h = 9 + (k % 3) * 5;
              const tipX = ox + r.lean * (h * 0.18);
              return (
                <g key={k}>
                  <path d={`M${ox},${baseY} Q${(ox + tipX) / 2},${baseY - h * 0.5} ${tipX},${baseY - h}`}
                        stroke="#3a6b28" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  <rect x={tipX - 1.5} y={baseY - h - 3.5} width="3" height="3.5" fill="#7a5a2a" rx="1" />
                </g>
              );
            })}
            <ellipse cx={baseX} cy={baseY + 1} rx={r.n * 2.2} ry="2" fill="#4f8c34" opacity="0.85" />
          </g>
        );
      })}

      {/* small rocks on shore */}
      <g transform={`translate(${cx - rx * 0.78}, ${cy + ry * 0.72})`}>
        <ellipse cx="0"  cy="2"   rx="9" ry="1.5" fill="rgba(0,0,0,0.18)" />
        <ellipse cx="0"  cy="0"   rx="9" ry="3"   fill="#8a8e90" />
        <ellipse cx="-1" cy="-0.5" rx="6" ry="1.5" fill="#a8acb0" />
      </g>
      <g transform={`translate(${cx - rx * 0.55}, ${cy + ry * 0.82})`}>
        <ellipse cx="0" cy="0" rx="5" ry="2" fill="#6e7378" />
      </g>

      {/* the frog peeking out of the grass */}
      <g transform={`translate(${cx + rx * 0.62}, ${cy + ry * 0.78})`}>
        <ellipse cx="0" cy="3" rx="5" ry="1.2" fill="rgba(0,0,0,0.22)" />
        <rect x="-4" y="-1" width="8" height="3" fill="#3d7c2a" />
        <rect x="-3" y="-3" width="6" height="2" fill="#3d7c2a" />
        <rect x="-3" y="-4" width="2" height="2" fill="#3d7c2a" />
        <rect x="1"  y="-4" width="2" height="2" fill="#3d7c2a" />
        <rect x="-2" y="-3" width="1" height="1" fill="#000" />
        <rect x="2"  y="-3" width="1" height="1" fill="#000" />
      </g>
    </svg>
  );
}
