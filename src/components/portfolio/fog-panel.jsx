// Reusable modal panel — used by both the cloud labels (about/skills/etc) and
// the project "Read More" buttons. Same shape, just different `data`:
//
//   { label, color, accent, body: ({ Section, P, Tag, Row, Job }) => JSX }
//
// Two ways to feed it data:
//   <FogPanel contentKey="about" onClose={...} />     // looks up CLOUD_CONTENT
//   <FogPanel data={PROJECT_DETAILS.teamup} ... />    // direct entry
//
// The "fog" comes from a stack of overlapping radial gradients that drift
// across the screen via the `fogDrift` keyframe.

import React from 'react';
import { CLOUD_CONTENT } from '../../data/content.jsx';
import { FONTS } from '../../theme.js';
import { buildPanelComponents } from './panel-typography.jsx';

const FOG_LAYERS = 6;

export default function FogPanel({ contentKey, data: dataProp, onClose }) {
  const data = dataProp || CLOUD_CONTENT[contentKey];
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 420);
  };

  const opening = mounted && !closing;
  const components = React.useMemo(() => buildPanelComponents(data.accent), [data.accent]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, pointerEvents: 'auto' }} onClick={close}>
      {/* darkening backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(20, 30, 50, 0.35)',
          backdropFilter: 'blur(2px)',
          opacity: opening ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* drifting fog gradients */}
      {Array.from({ length: FOG_LAYERS }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${-10 + (i * 18) % 100}%`,
            left: `${-30 + (i * 23) % 60}%`,
            width: '180%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${data.color}cc 0%, ${data.color}55 30%, transparent 70%)`,
            animation: `fogDrift ${20 + i * 4}s linear infinite`,
            animationDelay: `-${i * 3}s`,
            opacity: opening ? (0.7 - i * 0.06) : 0,
            transition: 'opacity 0.5s ease',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* the panel itself */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: opening
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.7)',
          opacity: opening ? 1 : 0,
          transition: 'transform 0.45s cubic-bezier(.2,.9,.3,1.2), opacity 0.35s ease',
          width: 'min(720px, 90vw)',
          maxHeight: '82vh',
          background: data.color,
          border: `3px solid ${data.accent}`,
          borderRadius: 8,
          boxShadow: '0 12px 0 rgba(0,0,0,0.18), 0 28px 60px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            background: data.accent,
            color: '#fff',
            fontFamily: FONTS.pixel,
            fontSize: 14,
            letterSpacing: '0.5px',
            textShadow: '1px 1px 0 rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid rgba(0,0,0,0.25)',
          }}
        >
          <span>☁ {data.label}</span>
          <button
            onClick={close}
            style={{
              background: 'rgba(0,0,0,0.18)',
              border: '2px solid rgba(0,0,0,0.35)',
              color: '#fff',
              fontFamily: FONTS.pixel,
              fontSize: 10,
              padding: '6px 10px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        <div
          style={{
            padding: '20px 28px 28px 28px',
            overflowY: 'auto',
            flex: 1,
            // faint horizontal line texture for that "notebook paper" feel
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 28px, ${data.accent}08 28px 29px)`,
          }}
        >
          {data.body(components)}
        </div>
      </div>
    </div>
  );
}
