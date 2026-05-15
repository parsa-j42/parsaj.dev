// Drifting clouds across the sky. Each cloud has a hanging banner with a
// label; clicking opens the matching FogPanel. Position + speed vary per
// cloud so the sky doesn't feel mechanical.

import React from 'react';
import { PixelCloud } from '../pixel/decor.jsx';
import { FONTS } from '../../theme.js';
import FogPanel from './fog-panel.jsx';

const CLOUDS = [
  { id: 'about',        label: 'About Me',     accent: '#d18a4a', top: '6%',  duration: 95,  delay: 0,  scale: 1.0,  dir: 'ltr' },
  { id: 'experiences',  label: 'Experiences',  accent: '#3a8ec7', top: '14%', duration: 110, delay: 28, scale: 1.05, dir: 'ltr' },
  { id: 'skills',       label: 'Skills',       accent: '#3aa07a', top: '3%',  duration: 80,  delay: 12, scale: 0.85, dir: 'rtl' },
  { id: 'certificates', label: 'Certificates', accent: '#e98a3a', top: '20%', duration: 130, delay: 55, scale: 0.95, dir: 'rtl' },
  { id: 'education',    label: 'Education',    accent: '#7c5cc7', top: '9%',  duration: 105, delay: 70, scale: 0.9,  dir: 'ltr' },
];

function DriftCloud({ id, label, accent, top, duration, delay, scale, dir, onClick }) {
  const [hover, setHover] = React.useState(false);
  const cloudW = 240;
  const cloudH = 100;
  const bannerW = Math.max(96, label.length * 11 + 24);
  const bannerH = 28;
  const tilt = (id.charCodeAt(0) % 5) - 2; // a tiny "this banner is hand-tied" lean

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left:  dir === 'rtl' ? undefined : '-260px',
        right: dir === 'rtl' ? '-260px'  : undefined,
        animation: `${dir === 'rtl' ? 'cloudDriftRtl' : 'cloudDrift'} ${duration}s linear infinite`,
        animationDelay: `-${delay}s`,
        cursor: 'pointer',
        transition: 'transform 0.25s ease',
        transform: `scale(${scale}) ${hover ? 'translateY(-3px)' : ''}`,
        zIndex: 30,
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
    >
      <div
        style={{
          position: 'relative',
          filter: hover
            ? 'drop-shadow(0 6px 12px rgba(255,255,255,0.5))'
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.10))',
          width: cloudW,
        }}
      >
        <PixelCloud width={cloudW} height={cloudH} hover={hover} />

        {/* hanging banner */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: cloudH - 8,
            transform: `translateX(-50%) rotate(${tilt}deg)`,
            width: bannerW,
            pointerEvents: 'none',
            animation: 'bannerSway 4s ease-in-out infinite alternate',
            transformOrigin: 'top center',
          }}
        >
          {/* the two strings tying the banner to the cloud */}
          <svg width={bannerW} height="14" style={{ display: 'block', overflow: 'visible', marginBottom: -2 }}>
            <line x1={bannerW * 0.22} y1="0" x2={bannerW * 0.28} y2="14" stroke="rgba(60,40,20,0.55)" strokeWidth="1" />
            <line x1={bannerW * 0.78} y1="0" x2={bannerW * 0.72} y2="14" stroke="rgba(60,40,20,0.55)" strokeWidth="1" />
          </svg>

          <div
            style={{
              position: 'relative',
              height: bannerH,
              background: '#f4ebd1',
              border: '2px solid #4f2e15',
              borderRadius: 3,
              boxShadow: '0 3px 0 #4f2e15, 0 5px 10px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `linear-gradient(180deg, ${accent} 0, ${accent} 5px, #f4ebd1 5px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.pixel,
                fontSize: 9,
                color: '#3a2a16',
                letterSpacing: '0.5px',
                marginTop: 4,
                textTransform: 'uppercase',
                textShadow: '0 1px 0 rgba(255,255,255,0.6)',
              }}
            >
              {label}
            </span>
            {/* corner rivets */}
            <div style={{ position: 'absolute', top: 7, left: 4, width: 2, height: 2, background: '#4f2e15' }} />
            <div style={{ position: 'absolute', top: 7, right: 4, width: 2, height: 2, background: '#4f2e15' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CloudsLayer({ visible }) {
  const [openKey, setOpenKey] = React.useState(null);

  if (!visible) return null;

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
        {CLOUDS.map((c) => (
          <DriftCloud key={c.id} {...c} onClick={setOpenKey} />
        ))}
      </div>
      {openKey && <FogPanel contentKey={openKey} onClose={() => setOpenKey(null)} />}
    </>
  );
}
