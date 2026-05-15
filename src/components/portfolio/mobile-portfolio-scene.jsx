// Vertical Journey: portrait-shaped portfolio for narrow viewports.
//
// Top of the page is a sky band with drifting clouds (the nav). Below it sits
// a tall scrollable meadow with a winding pixel-art trail; each project is a
// billboard at one of the trail's curves, surrounded by a small decor cluster.
// A pond shows up midway as a "rest stop". The sky scrolls with the rest of
// the page, so once the user is past it the cloud nav is no longer visible.
//
// Reuses every sprite, the Pond, the ProjectSign/Post billboard, FogPanel, and
// the DriftCloud component from the desktop scene. Only layout differs.

import React from 'react';
import { PROJECTS } from '../../data/projects.js';
import { PROJECT_DETAILS } from '../../data/content.jsx';
import {
  PixelTree,
  PixelFlower,
  PixelBush,
  PixelMushroom,
  Butterfly,
} from '../pixel/decor.jsx';
import Pond from './pond.jsx';
import { ProjectSign, ProjectPost } from './project-billboard.jsx';
import FogPanel from './fog-panel.jsx';
import { DriftCloud } from './clouds-layer.jsx';

// ── Layout constants ─────────────────────────────────────────────────────────

const STRIP_VH      = 24;   // sticky sky strip height (vh)
const HILLS_H       = 160;  // top hills band inside the meadow (px)
const MEADOW_H      = 2300; // total scrollable meadow height (px)
const POND_Y        = 960;  // pond center within the meadow
const VIGNETTE_BLOCK_H = 320;

// Five project vignettes, ordered top -> bottom. `side` controls which edge of
// the screen the billboard hugs; `decor` selects a palette of small sprites.
// All ys start below the hills band so billboards never overlap the horizon.
const VIGNETTES = [
  { id: 'teamup',    side: 'left',   y: 320,  decor: 'warm' },
  { id: 'inktoner',  side: 'right',  y: 660,  decor: 'cool' },
  { id: 'schedule',  side: 'left',   y: 1260, decor: 'cool' },
  { id: 'nl2sql',    side: 'right',  y: 1620, decor: 'warm' },
  { id: 'parsajdev', side: 'center', y: 1980, decor: 'mix'  },
];

// Path waypoints, derived from VIGNETTES so a vignette's y only lives in one
// place. SVG cubic curves ease between consecutive anchors. The first anchor
// sits inside the hills band so the trail descends from behind the horizon.
const SIDE_X = { left: 25, right: 75, center: 50 };
const wp = (i) => [SIDE_X[VIGNETTES[i].side], VIGNETTES[i].y];

const PATH_ANCHORS = [
  [50, 70],
  wp(0), wp(1),
  [50, POND_Y],
  wp(2), wp(3), wp(4),
  [50, MEADOW_H + 40],
];

// Small sprite clusters per vignette. Coords are % inside the vignette's box.
// Format: [kind, left%, top%, color | bushScale]
const DECOR_PALETTES = {
  warm: [
    ['flower',   '8%',  '10%', '#e85a8c'],
    ['flower',   '6%',  '78%', '#ffd14a'],
    ['flower',   '84%', '20%', '#ffffff'],
    ['flower',   '88%', '76%', '#a55ae8'],
    ['mushroom', '78%', '48%', '#c43a3a'],
    ['bush',     '4%',  '62%', 3],
  ],
  cool: [
    ['flower',   '8%',  '20%', '#a55ae8'],
    ['flower',   '12%', '82%', '#ffffff'],
    ['flower',   '84%', '12%', '#ffd14a'],
    ['flower',   '88%', '70%', '#e85a8c'],
    ['mushroom', '6%',  '46%', '#e98a3a'],
    ['bush',     '86%', '58%', 3],
  ],
  mix: [
    ['flower',   '18%', '14%', '#e85a8c'],
    ['flower',   '80%', '14%', '#ffd14a'],
    ['flower',   '14%', '84%', '#a55ae8'],
    ['flower',   '82%', '84%', '#ffffff'],
    ['flower',   '50%', '4%',  '#ff7ab4'],
    ['mushroom', '12%', '52%', '#c43a3a'],
    ['mushroom', '86%', '52%', '#e98a3a'],
  ],
};

// Distant pixel trees scattered on the meadow's top hills. Positions are
// absolute px inside the meadow so they line up with the hills SVG below.
const HILL_TREES = [
  { left: '8%',  top: 78,  scale: 2, variant: 0 },
  { left: '22%', top: 96,  scale: 2, variant: 1 },
  { left: '42%', top: 82,  scale: 2, variant: 2 },
  { left: '60%', top: 100, scale: 2, variant: 0 },
  { left: '78%', top: 86,  scale: 2, variant: 1 },
  { left: '92%', top: 104, scale: 2, variant: 2 },
];

// Five labels across three vertical lanes (top 10% / 26% / 42% of the strip).
// Lanes are spaced wide enough that cloud bodies plus their hanging banners
// never overlap a neighbouring lane. The outer lanes carry two clouds each,
// staggered far enough in time that when both are on-screen they sit at
// opposite edges and drift the same way (reads like a small convoy). Middle
// lane carries the one ltr cloud so adjacent lanes always alternate direction.
const MOBILE_CLOUDS = [
  { id: 'about',        label: 'About Me',     accent: '#d18a4a', top: '10%', duration: 38, delay: 0,  scale: 0.55, dir: 'ltr' },
  { id: 'skills',       label: 'Skills',       accent: '#3aa07a', top: '26%', duration: 36, delay: 6,  scale: 0.50, dir: 'rtl' },
  { id: 'experiences',  label: 'Experiences',  accent: '#3a8ec7', top: '42%', duration: 50, delay: 12, scale: 0.55, dir: 'ltr' },
  { id: 'certificates', label: 'Certificates', accent: '#e98a3a', top: '26%', duration: 48, delay: 28, scale: 0.55, dir: 'rtl' },
  { id: 'education',    label: 'Education',    accent: '#7c5cc7', top: '10%', duration: 42, delay: 22, scale: 0.50, dir: 'ltr' },
];

// Ambient butterflies at fixed y-rows in the meadow.
const BUTTERFLIES = [
  { y: 420,  c1: '#e85a8c', c2: '#ff7ab4', delay: 0   },
  { y: 1040, c1: '#a55ae8', c2: '#7a3ad0', delay: 1.2 },
  { y: 1720, c1: '#ffd14a', c2: '#ffaa1f', delay: 0.6 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

// Cubic Bezier through a list of [x, y] anchors with smooth handles.
function buildPathD(points) {
  if (!points.length) return '';
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const halfDy = (y1 - y0) * 0.5;
    d += ` C ${x0},${y0 + halfDy} ${x1},${y1 - halfDy} ${x1},${y1}`;
  }
  return d;
}

// Same firefly recipe as the desktop scene, biased into the lower meadow.
function fireflyStyle(i, originY) {
  return {
    position: 'absolute',
    left: `${5 + (i * 79) % 90}%`,
    top: originY + (i * 53) % 700,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'rgba(255,250,200,0.9)',
    boxShadow: '0 0 8px rgba(255,236,140,0.85)',
    animation: `floatBob ${6 + (i % 5)}s ease-in-out infinite alternate, twinkleDot 2.${i % 9}s ease-in-out infinite`,
    animationDelay: `-${i * 0.4}s`,
    pointerEvents: 'none',
  };
}

// ── Sub-components ───────────────────────────────────────────────────────────

// Sky band scrolls away with the rest of the page (not sticky). Once the user
// is past it, they're "in the meadow" with no sky visible. Cloud nav becomes
// inaccessible after scrolling, which is the intended tradeoff for an
// immersive, in-world feel.
function SkyStrip({ onCloudClick }) {
  return (
    <div
      style={{
        position: 'relative',
        height: `${STRIP_VH}vh`,
        overflow: 'hidden',
        // Sky bottom matches the lightest hill color in the meadow below so the
        // seam between the two stacking contexts disappears.
        background: 'linear-gradient(180deg, #84caff 0%, #b9e2ff 70%, #c5dec5 100%)',
      }}
    >
      {/* sun haze */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 110,
          height: 110,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,236,180,0.7) 0%, rgba(255,220,140,0.3) 40%, rgba(255,220,140,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {MOBILE_CLOUDS.map((c) => (
        <DriftCloud key={c.id} {...c} onClick={onCloudClick} cloudW={180} cloudH={76} />
      ))}
    </div>
  );
}

// Top of the meadow: four overlapping hill silhouettes that pick up where the
// strip's sky-bottom leaves off, then fade into the grass texture. Same recipe
// as the desktop SkyAndHills, just compressed into a fixed band.
function MeadowHills() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: HILLS_H,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height={HILLS_H}
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        <path d="M0,18 Q20,6  40,14 T80,12 T100,18 L100,60 L0,60 Z" fill="#a0c8a8" opacity="0.85" />
        <path d="M0,28 Q25,16 50,22 T100,22                L100,60 L0,60 Z" fill="#7fb96a" />
        <path d="M0,38 Q30,30 60,34 T100,34                L100,60 L0,60 Z" fill="#6aa552" />
        <path d="M0,48 Q20,42 50,46 T100,46                L100,60 L0,60 Z" fill="#588f43" />
      </svg>

      {HILL_TREES.map((t, i) => (
        <div
          key={`ht-${i}`}
          style={{ position: 'absolute', left: t.left, top: t.top, opacity: 0.85 }}
        >
          <PixelTree scale={t.scale} variant={t.variant} />
        </div>
      ))}

      {/* feather the hill base into the grass tile so the boundary is soft */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -6,
          height: 14,
          background: 'linear-gradient(180deg, rgba(88,143,67,0) 0%, rgba(88,143,67,0.55) 100%)',
        }}
      />
    </div>
  );
}

function WindingPath() {
  const d = React.useMemo(() => buildPathD(PATH_ANCHORS), []);
  return (
    <svg
      width="100%"
      height={MEADOW_H}
      viewBox={`0 0 100 ${MEADOW_H}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* outer dirt band, then lighter inner band */}
      <path d={d} stroke="#a67149" strokeWidth="42" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
      <path d={d} stroke="#bf8a5e" strokeWidth="28" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
      {/* sprinkled darker pebbles */}
      {Array.from({ length: 36 }).map((_, i) => {
        const t = i / 35;
        const idx = Math.min(PATH_ANCHORS.length - 2, Math.floor(t * (PATH_ANCHORS.length - 1)));
        const u = t * (PATH_ANCHORS.length - 1) - idx;
        const x = PATH_ANCHORS[idx][0] * (1 - u) + PATH_ANCHORS[idx + 1][0] * u;
        const y = PATH_ANCHORS[idx][1] * (1 - u) + PATH_ANCHORS[idx + 1][1] * u + Math.sin(i) * 6;
        return <rect key={i} x={x - 0.6} y={y} width="1.2" height="4" fill="#8a5a35" opacity="0.6" />;
      })}
    </svg>
  );
}

function Vignette({ v, expanded, onToggle, onReadMore }) {
  const project = PROJECTS.find((p) => p.id === v.id);
  if (!project) return null;

  const sideStyle =
    v.side === 'left'  ? { left: '4%' } :
    v.side === 'right' ? { right: '4%' } :
                         { left: '50%', transform: 'translateX(-50%)' };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: v.y - VIGNETTE_BLOCK_H / 2,
        height: VIGNETTE_BLOCK_H,
        pointerEvents: 'none',
      }}
    >
      {(DECOR_PALETTES[v.decor] || []).map(([kind, l, t, extra], i) => {
        const wrap = { position: 'absolute', left: l, top: t };
        if (kind === 'flower')   return <div key={i} style={wrap}><PixelFlower scale={3} color={extra} /></div>;
        if (kind === 'mushroom') return <div key={i} style={wrap}><PixelMushroom scale={3} color={extra} /></div>;
        if (kind === 'bush')     return <div key={i} style={wrap}><PixelBush scale={extra} /></div>;
        return null;
      })}

      {/* post first so the expanded sign always stacks above it */}
      <div style={{ position: 'absolute', top: 24, ...sideStyle, pointerEvents: 'none', zIndex: 1 }}>
        <ProjectPost project={project} compact />
      </div>

      <div style={{ position: 'absolute', top: 24, ...sideStyle, pointerEvents: 'auto', zIndex: expanded ? 50 : 10 }}>
        <ProjectSign
          project={project}
          expanded={expanded}
          onToggle={onToggle}
          onReadMore={onReadMore}
          compact
        />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function MobilePortfolioScene({ visible }) {
  const [expandedId, setExpandedId] = React.useState(null);
  const [readMoreId, setReadMoreId] = React.useState(null);
  const [openCloud,  setOpenCloud]  = React.useState(null);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: '#84caff',
        }}
      >
        <SkyStrip onCloudClick={setOpenCloud} />

        <div
          style={{
            position: 'relative',
            height: MEADOW_H,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 100%),' +
              'repeating-linear-gradient(90deg, #6abe4a 0 6px, #5fb443 6px 12px),' +
              'repeating-linear-gradient(0deg, #6abe4a 0 6px, #4f9c34 6px 12px)',
            backgroundBlendMode: 'multiply, normal, normal',
          }}
        >
          {/* Path renders first so the hills below can cover its top stretch,
              making the trail look like it descends from behind the horizon. */}
          <WindingPath />
          <MeadowHills />

          {/* pond rest stop */}
          <div
            style={{
              position: 'absolute',
              top: POND_Y - 55,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 4,
            }}
          >
            <Pond width={260} height={110} />
          </div>

          {VIGNETTES.map((v) => (
            <Vignette
              key={v.id}
              v={v}
              expanded={expandedId === v.id}
              onToggle={() => setExpandedId(expandedId === v.id ? null : v.id)}
              onReadMore={() => setReadMoreId(v.id)}
            />
          ))}

          {BUTTERFLIES.map((b, i) => (
            <div
              key={`bf-${i}`}
              style={{
                position: 'absolute',
                left: '10%',
                top: b.y,
                animation: `butterflyDrift ${12 + i * 2}s ease-in-out infinite alternate`,
                animationDelay: `-${b.delay}s`,
                pointerEvents: 'none',
                zIndex: 6,
              }}
            >
              <div style={{ animation: `bob ${1.6 + i * 0.3}s ease-in-out infinite alternate` }}>
                <Butterfly color1={b.c1} color2={b.c2} scale={2} />
              </div>
            </div>
          ))}

          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`ff-${i}`} style={fireflyStyle(i, 1100)} />
          ))}

          {/* gentle vignette so the edges feel framed rather than abrupt */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.15) 100%)',
            }}
          />
        </div>
      </div>

      {readMoreId && PROJECT_DETAILS[readMoreId] && (
        <FogPanel data={PROJECT_DETAILS[readMoreId]} onClose={() => setReadMoreId(null)} />
      )}
      {openCloud && <FogPanel contentKey={openCloud} onClose={() => setOpenCloud(null)} />}
    </div>
  );
}
