// Pastoral landing scene. Composes the sky/hills, decor scatter, the pond,
// project billboards, and the drifting clouds layer on top. Owns two pieces
// of state: which billboard is expanded, and which "Read More" panel is open.

import React from 'react';
import { PROJECTS } from '../../data/projects.js';
import { PROJECT_DETAILS } from '../../data/content.jsx';
import {
  PixelTree,
  PixelFlower,
  PixelBush,
  PixelMushroom,
  PixelRock,
  PixelFencePost,
  Butterfly,
} from '../pixel/decor.jsx';
import SkyAndHills from './sky-and-hills.jsx';
import Pond from './pond.jsx';
import { ProjectPost, ProjectSign } from './project-billboard.jsx';
import CloudsLayer from './clouds-layer.jsx';
import FogPanel from './fog-panel.jsx';

// ── Scattered decor positions ──────────────────────────────────────────────
// All percentages - keep relative so the scene reflows with the viewport.

const FLOWERS = [
  ['3%', '70%', '#e85a8c'], ['5%', '78%', '#ffd14a'], ['2%', '86%', '#ffffff'],
  ['4%', '92%', '#a55ae8'],
  ['33%', '78%', '#ffd14a'], ['34%', '86%', '#a55ae8'], ['36%', '92%', '#e85a8c'],
  ['28%', '94%', '#ffffff'], ['31%', '70%', '#ff7ab4'],
  ['60%', '76%', '#a55ae8'], ['62%', '88%', '#ffd14a'], ['63%', '94%', '#ffffff'],
  ['58%', '70%', '#e85a8c'],
  ['9%', '60%', '#ffd14a'], ['12%', '62%', '#ffffff'], ['6%', '64%', '#a55ae8'],
  ['23%', '60%', '#e85a8c'], ['26%', '62%', '#ffd14a'],
  ['95%', '70%', '#a55ae8'], ['96%', '80%', '#ffd14a'], ['93%', '88%', '#ffffff'],
  ['97%', '92%', '#e85a8c'], ['91%', '76%', '#ffd14a'],
  ['33%', '54%', '#ffffff'], ['56%', '54%', '#ffd14a'], ['58%', '60%', '#a55ae8'],
  ['44%', '94%', '#ffffff'], ['68%', '94%', '#e85a8c'], ['72%', '76%', '#ffd14a'],
  ['76%', '90%', '#a55ae8'], ['82%', '78%', '#ffd14a'], ['86%', '90%', '#ffffff'],
  ['18%', '90%', '#ff7ab4'], ['41%', '60%', '#a55ae8'],
];

const BUSHES = [
  ['5%', '60%', 4], ['11%', '57%', 3], ['33%', '63%', 3],
  ['57%', '60%', 4], ['80%', '61%', 3], ['95%', '64%', 3],
  ['25%', '54%', 3], ['68%', '54%', 3], ['86%', '55%', 4],
];

const MUSHROOMS = [
  ['22%', '83%', '#c43a3a'], ['65%', '85%', '#e85a8c'],
  ['39%', '78%', '#c43a3a'], ['78%', '92%', '#e98a3a'],
];

const ROCKS = [
  ['6%', '72%'], ['44%', '76%'], ['76%', '70%'], ['90%', '88%'], ['30%', '92%'],
];

const TREES = [
  { left: '2%',   bottom: '40%', scale: 6, variant: 0 },
  { right: '4%',  bottom: '46%', scale: 5, variant: 2 },
  { left: '37%',  bottom: '21%', scale: 4, variant: 1 },
  { right: '34%', bottom: '20%', scale: 3, variant: 0 },
  { left: '34%',  bottom: '36%', scale: 3, variant: 2 },
  { right: '24%', bottom: '42%', scale: 4, variant: 1 },
  { right: '2%',  bottom: '8%',  scale: 5, variant: 0 },
];

const FENCES = [
  { left:  '2%',  top: '66%' },
  { left:  '11%', top: '66%' },
  { right: '2%',  top: '65%' },
  { right: '11%', top: '65%' },
];

const BUTTERFLIES = [
  { left: '12%', top: '50%', delay: 0,   c1: '#e85a8c', c2: '#ff7ab4' },
  { left: '54%', top: '46%', delay: 1.4, c1: '#a55ae8', c2: '#7a3ad0' },
  { left: '78%', top: '52%', delay: 0.6, c1: '#ffd14a', c2: '#ffaa1f' },
];

// 14 small drifting glow dots in the lower half of the screen.
function fireflyStyle(i) {
  const left = (5 + (i * 79) % 90) + '%';
  const top  = (45 + (i * 53) % 45) + '%';
  const dur  = 6 + (i % 5);
  return {
    position: 'absolute',
    left,
    top,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'rgba(255,250,200,0.9)',
    boxShadow: '0 0 8px rgba(255,236,140,0.85)',
    animation: `floatBob ${dur}s ease-in-out infinite alternate, twinkleDot 2.${i % 9}s ease-in-out infinite`,
    animationDelay: `-${i * 0.4}s`,
    pointerEvents: 'none',
  };
}

export default function PortfolioScene({ visible }) {
  const [expandedId, setExpandedId] = React.useState(null);
  const [readMoreId, setReadMoreId] = React.useState(null);

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
      <SkyAndHills />

      <div style={{ position: 'absolute', left: '36%', top: '52%' }}>
        <Pond width={340} height={140} />
      </div>

      {FENCES.map((f, i) => (
        <div key={`fence-${i}`} style={{ position: 'absolute', ...f }}>
          <PixelFencePost scale={3} />
        </div>
      ))}

      {TREES.map((t, i) => (
        <div key={`tree-${i}`} style={{ position: 'absolute', ...t }}>
          <PixelTree scale={t.scale} variant={t.variant} />
        </div>
      ))}

      {BUSHES.map(([l, t, s], i) => (
        <div key={`b-${i}`} style={{ position: 'absolute', left: l, top: t }}>
          <PixelBush scale={s} />
        </div>
      ))}

      {MUSHROOMS.map(([l, t, c], i) => (
        <div key={`m-${i}`} style={{ position: 'absolute', left: l, top: t }}>
          <PixelMushroom scale={3} color={c} />
        </div>
      ))}

      {ROCKS.map(([l, t], i) => (
        <div key={`r-${i}`} style={{ position: 'absolute', left: l, top: t }}>
          <PixelRock scale={3} />
        </div>
      ))}

      {FLOWERS.map(([l, t, c], i) => (
        <div key={`f-${i}`} style={{ position: 'absolute', left: l, top: t }}>
          <PixelFlower scale={3} color={c} />
        </div>
      ))}

      {BUTTERFLIES.map((b, i) => (
        <div
          key={`bf-${i}`}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            animation: `butterflyDrift ${10 + i * 2}s ease-in-out infinite alternate`,
            animationDelay: `-${b.delay}s`,
            pointerEvents: 'none',
          }}
        >
          <div style={{ animation: `bob ${1.6 + i * 0.3}s ease-in-out infinite alternate` }}>
            <Butterfly color1={b.c1} color2={b.c2} scale={2} />
          </div>
        </div>
      ))}

      {Array.from({ length: 14 }).map((_, i) => (
        <div key={`ff-${i}`} style={fireflyStyle(i)} />
      ))}

      {/* Posts always sit at low z so an expanded sign never lifts its post
          above neighbouring signs. */}
      {PROJECTS.map((p) => (
        <div key={`post-${p.id}`} style={{ position: 'absolute', ...p.pos, zIndex: 5, pointerEvents: 'none' }}>
          <ProjectPost project={p} />
        </div>
      ))}

      {PROJECTS.map((p) => (
        <div
          key={`sign-${p.id}`}
          style={{ position: 'absolute', ...p.pos, zIndex: expandedId === p.id ? 50 : 10 }}
        >
          <ProjectSign
            project={p}
            expanded={expandedId === p.id}
            onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            onReadMore={() => setReadMoreId(p.id)}
          />
        </div>
      ))}

      <CloudsLayer visible={visible} />

      {readMoreId && PROJECT_DETAILS[readMoreId] && (
        <FogPanel data={PROJECT_DETAILS[readMoreId]} onClose={() => setReadMoreId(null)} />
      )}

      {/* subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </div>
  );
}
