// Landscape sprites — trees, flowers, bushes, mushrooms, rocks, fence, butterfly.
// All of them are tiny pixel grids run through <PixelGrid>. The fence and the
// butterfly are slightly different shapes (drawn with explicit rects) since
// they don't fit a uniform grid the same way.

import React from 'react';
import { PixelGrid } from './sprite.jsx';

// ── Trees ────────────────────────────────────────────────────────────────────
// 3 variants. `T` is the trunk, `G`/`g` are leaf shades.

const TREE_VARIANTS = [
  [
    '...GGG...',
    '..GGGGG..',
    '.GGGGGGG.',
    '.GgGGGGG.',
    'GGGGGGGgG',
    'GGGGGGGGG',
    '.GGGGGGG.',
    '..GGGGG..',
    '...TTT...',
    '...TTT...',
    '...TTT...',
  ],
  [
    '....G....',
    '...GGG...',
    '..GGGGG..',
    '.GGGGGGG.',
    'GGGGGGGGG',
    '.GGgGGGG.',
    '..GGGGG..',
    '...GGG...',
    '....G....',
    '...TTT...',
    '...TTT...',
  ],
  [
    '..GGGGG..',
    '.GGGGGGG.',
    'GGGGgGGGG',
    'GGGGGGGGG',
    'gGGGGGGgG',
    'GGGGGGGGG',
    '.GGGGGGG.',
    '..GGGGG..',
    '...TTT...',
    '...TTT...',
  ],
];
const TREE_PALETTE = { G: '#3f7c2c', g: '#2d5e1c', T: '#5a3a1f' };

export function PixelTree({ scale = 3, variant = 0 }) {
  return (
    <PixelGrid
      grid={TREE_VARIANTS[variant % TREE_VARIANTS.length]}
      palette={TREE_PALETTE}
      scale={scale}
    />
  );
}

// ── Flowers ──────────────────────────────────────────────────────────────────

const FLOWER_GRID = [
  '.P.P.',
  'PPPPP',
  '.PYP.',
  '..S..',
  '.SSS.',
];

export function PixelFlower({ scale = 2, color = '#e85a8c' }) {
  return (
    <PixelGrid
      grid={FLOWER_GRID}
      palette={{ P: color, Y: '#ffd14a', S: '#3f7c2c' }}
      scale={scale}
    />
  );
}

// ── Bush ─────────────────────────────────────────────────────────────────────

const BUSH_GRID = [
  '..GGG..',
  '.GGGGG.',
  'GGGgGGG',
  'GGGGGGG',
  '.GGGGG.',
];

export function PixelBush({ scale = 3 }) {
  return (
    <PixelGrid
      grid={BUSH_GRID}
      palette={{ G: '#4d8c39', g: '#3a6b28' }}
      scale={scale}
    />
  );
}

// ── Mushroom ─────────────────────────────────────────────────────────────────

const MUSHROOM_GRID = [
  '.RRRR.',
  'RRRRRR',
  'RRwRRR',
  '.SSSS.',
  '..SS..',
];

export function PixelMushroom({ scale = 3, color = '#c43a3a' }) {
  return (
    <PixelGrid
      grid={MUSHROOM_GRID}
      palette={{ R: color, w: '#ffffff', S: '#f3e6c8' }}
      scale={scale}
    />
  );
}

// ── Rock ─────────────────────────────────────────────────────────────────────

const ROCK_GRID = [
  '..RRR..',
  '.RRRRRr',
  'RRRrRRR',
  'RRRRRRr',
  '.RRRRR.',
];

export function PixelRock({ scale = 3 }) {
  return (
    <PixelGrid
      grid={ROCK_GRID}
      palette={{ R: '#9aa1a8', r: '#6e757c' }}
      scale={scale}
    />
  );
}

// ── Fence post + slats ───────────────────────────────────────────────────────
// Three vertical posts joined by two horizontal slats. Hand-drawn rects so the
// posts can be slightly thicker than 1 pixel without inflating the grid.

export function PixelFencePost({ scale = 3 }) {
  return (
    <svg width={26 * scale} height={11 * scale} style={{ display: 'block' }}>
      <rect x={0} y={3 * scale} width={26 * scale} height={1.4 * scale} fill="#a07246" />
      <rect x={0} y={7 * scale} width={26 * scale} height={1.4 * scale} fill="#a07246" />
      {[1, 12, 23].map((px) => (
        <rect key={px} x={px * scale} y={0} width={1.6 * scale} height={11 * scale} fill="#7a4a26" />
      ))}
      {[1, 12, 23].map((px) => (
        <rect key={'s' + px} x={(px + 1.2) * scale} y={0} width={0.4 * scale} height={11 * scale} fill="#4f2e15" />
      ))}
    </svg>
  );
}

// ── Butterfly ────────────────────────────────────────────────────────────────
// Wings flap via CSS keyframes (`wingFlap` / `wingFlap2`). Steps(2) gives that
// classic pixel-art "two-frame" flutter rather than a smooth tween.

export function Butterfly({ color1 = '#e85a8c', color2 = '#a55ae8', scale = 3 }) {
  const cx = 4.5 * scale;
  const cy = 3 * scale;
  return (
    <svg width={9 * scale} height={6 * scale} style={{ display: 'block', overflow: 'visible' }}>
      {/* body */}
      <rect x={4 * scale} y={2 * scale} width={1 * scale} height={3 * scale} fill="#1a1a1a" />
      <rect x={4 * scale} y={1 * scale} width={1 * scale} height={1 * scale} fill="#1a1a1a" />
      {/* left wing */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wingFlap 0.18s steps(2) infinite' }}>
        <rect x={1 * scale} y={1 * scale} width={1 * scale} height={2 * scale} fill={color1} />
        <rect x={2 * scale} y={1 * scale} width={1 * scale} height={3 * scale} fill={color1} />
        <rect x={3 * scale} y={2 * scale} width={1 * scale} height={2 * scale} fill={color2} />
        <rect x={1 * scale} y={3 * scale} width={1 * scale} height={1 * scale} fill={color2} />
      </g>
      {/* right wing */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wingFlap2 0.18s steps(2) infinite' }}>
        <rect x={6 * scale} y={1 * scale} width={1 * scale} height={3 * scale} fill={color1} />
        <rect x={7 * scale} y={1 * scale} width={1 * scale} height={2 * scale} fill={color1} />
        <rect x={5 * scale} y={2 * scale} width={1 * scale} height={2 * scale} fill={color2} />
        <rect x={7 * scale} y={3 * scale} width={1 * scale} height={1 * scale} fill={color2} />
      </g>
    </svg>
  );
}

// ── Pixel cloud (used by the drifting CloudsLayer) ───────────────────────────
// Five overlapping ellipses. Not a strict grid — the bumpy "cloud" silhouette
// reads better with smooth ovals than with stair-stepped pixels.

export function PixelCloud({ width = 220, height = 90, hover = false }) {
  const w = width;
  const h = height;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id="cloudGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={hover ? 4 : 2} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#cloudGlow)">
        <ellipse cx={w * 0.25} cy={h * 0.65} rx={w * 0.22} ry={h * 0.30} fill="#ffffff" />
        <ellipse cx={w * 0.45} cy={h * 0.50} rx={w * 0.28} ry={h * 0.40} fill="#ffffff" />
        <ellipse cx={w * 0.70} cy={h * 0.55} rx={w * 0.25} ry={h * 0.35} fill="#ffffff" />
        <ellipse cx={w * 0.55} cy={h * 0.70} rx={w * 0.30} ry={h * 0.25} fill="#ffffff" />
        <ellipse cx={w * 0.85} cy={h * 0.70} rx={w * 0.15} ry={h * 0.22} fill="#ffffff" />
      </g>
      <ellipse cx={w * 0.55} cy={h * 0.88} rx={w * 0.45} ry={h * 0.06} fill="rgba(0,0,0,0.10)" />
    </svg>
  );
}
