// Two pieces:
//   - <ProjectPost>  the wooden post (always low z so an expanded sign never
//                    raises its post above neighbouring signs)
//   - <ProjectSign>  the actual interactive sign (clicks to expand + read more)
//
// `kind` selects one of the five "frames" - each frame has a slightly different
// header color and shadow so the five projects feel like distinct objects in
// the world rather than a uniform UI list.

import React from 'react';
import { FONTS } from '../../theme.js';

// Frame styles per `kind` from data/projects.js.
const FRAMES = {
  billboard: { head: '#7a4a26', body: '#f6e6c5', shadow: '0 8px 0 #4f2e15, 0 12px 24px rgba(0,0,0,0.25)', border: '3px solid #4f2e15' },
  shop:      { head: '#b94336', body: '#fbf2dd', shadow: '0 8px 0 #6a261c, 0 12px 24px rgba(0,0,0,0.25)', border: '3px solid #6a261c' },
  scroll:    { head: '#c79360', body: '#fdf4d4', shadow: '0 8px 0 #7a4a26, 0 12px 24px rgba(0,0,0,0.25)', border: '3px solid #7a4a26' },
  book:      { head: '#3a3a7a', body: '#e7e3ff', shadow: '0 8px 0 #20204a, 0 12px 24px rgba(0,0,0,0.30)', border: '3px solid #20204a' },
  plaque:    { head: '#5a4a2a', body: '#f4ebd1', shadow: '0 8px 0 #2e2410, 0 12px 24px rgba(0,0,0,0.25)', border: '3px solid #2e2410' },
};

export function ProjectPost({ project }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 260,
        transform: `rotate(${project.rotate}deg)`,
        transformOrigin: 'top center',
        pointerEvents: 'none',
      }}
    >
      {/* spacer so the post hangs below the sign's bounding box */}
      <div style={{ height: 230, visibility: 'hidden' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '92%',
          transform: 'translateX(-50%)',
          width: 14,
          height: 64,
          background: 'linear-gradient(180deg, #7a4a26 0%, #4f2e15 100%)',
          borderLeft:  '2px solid #2d1809',
          borderRight: '2px solid #2d1809',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.18)',
        }}
      />
    </div>
  );
}

export function ProjectSign({ project, expanded, onToggle, onReadMore }) {
  const { name, tagline, description, tech, accent, kind, rotate } = project;
  const F = FRAMES[kind] || FRAMES.billboard;
  const accentBg = `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`;

  // small "Coming soon" toast for the locked Visit button.
  const [showLockedMsg, setShowLockedMsg] = React.useState(false);
  const lockedTimer = React.useRef(null);
  const onLockedClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (lockedTimer.current) clearTimeout(lockedTimer.current);
    setShowLockedMsg(true);
    lockedTimer.current = setTimeout(() => setShowLockedMsg(false), 2400);
  };
  React.useEffect(() => () => { if (lockedTimer.current) clearTimeout(lockedTimer.current); }, []);

  return (
    <div
      onClick={onToggle}
      style={{
        position: 'relative',
        width: expanded ? 360 : 260,
        transition: 'width 0.35s cubic-bezier(.2,.9,.3,1.2), transform 0.35s ease',
        transform: `rotate(${expanded ? 0 : rotate}deg) translateY(${expanded ? '-8px' : '0'})`,
        transformOrigin: 'top center',
        cursor: 'pointer',
        fontFamily: FONTS.mono,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: F.body,
          border: F.border,
          boxShadow: F.shadow,
          borderRadius: 4,
          overflow: 'hidden',
          imageRendering: 'pixelated',
        }}
      >
        {/* header bar - title + accent diamond */}
        <div
          style={{
            background: F.head,
            color: '#fff8e1',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: FONTS.pixel,
            fontSize: 10,
            letterSpacing: '0.5px',
            textShadow: '1px 1px 0 rgba(0,0,0,0.4)',
            borderBottom: '2px solid rgba(0,0,0,0.25)',
          }}
        >
          <span>{name}</span>
          <span
            style={{
              width: 14,
              height: 14,
              background: accent,
              border: '2px solid rgba(0,0,0,0.4)',
              transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </div>

        {/* placeholder "project shot" - diagonal stripes on accent gradient */}
        <div
          style={{
            height: 100,
            background: accentBg,
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '2px solid rgba(0,0,0,0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 10,
              fontSize: 9,
              color: 'rgba(255,255,255,0.85)',
              fontFamily: FONTS.mono,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            [ project shot ]
          </div>
        </div>

        <div style={{ padding: '12px 14px 14px 14px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3a2a16', marginBottom: 6, lineHeight: 1.4 }}>
            {tagline}
          </div>

          {/* expandable section */}
          <div
            style={{
              maxHeight: expanded ? 240 : 0,
              opacity: expanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, opacity 0.3s ease',
            }}
          >
            <div style={{ fontSize: 11, color: '#4a3a26', lineHeight: 1.6, marginBottom: 10 }}>
              {description}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    padding: '3px 6px',
                    background: 'rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.18)',
                    color: '#3a2a16',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>
              {/* locked Visit button - shows toast on click */}
              <button
                type="button"
                onClick={onLockedClick}
                aria-label={`Visit ${name} (locked, coming soon)`}
                title="Coming soon"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#8a8a8a',
                  backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.18) 0 4px, rgba(255,255,255,0.06) 4px 8px)',
                  color: '#e8e8e8',
                  fontFamily: FONTS.pixel,
                  fontSize: 9,
                  padding: '8px 12px',
                  border: '2px solid rgba(0,0,0,0.45)',
                  boxShadow: '0 3px 0 rgba(0,0,0,0.35)',
                  letterSpacing: '0.5px',
                  cursor: 'not-allowed',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.45)',
                  overflow: 'hidden',
                }}
              >
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true" style={{ display: 'block' }}>
                  <path d="M2 5 V3.5 a3 3 0 0 1 6 0 V5" fill="none" stroke="#1a1a1a" strokeWidth="1.4" />
                  <rect x="1" y="5" width="8" height="6.5" rx="1" fill="#d9d9d9" stroke="#1a1a1a" strokeWidth="1" />
                  <rect x="4.4" y="7.2" width="1.2" height="2.6" fill="#1a1a1a" />
                </svg>
                VISIT
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReadMore && onReadMore(); }}
                style={{
                  display: 'inline-block',
                  background: '#f4ebd1',
                  color: '#3a2a16',
                  fontFamily: FONTS.pixel,
                  fontSize: 9,
                  padding: '8px 12px',
                  textDecoration: 'none',
                  border: '2px solid rgba(0,0,0,0.4)',
                  boxShadow: '0 3px 0 rgba(0,0,0,0.35)',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                }}
              >
                READ MORE
              </button>

              {showLockedMsg && (
                <div
                  role="status"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 'calc(100% + 8px)',
                    background: '#3a2a16',
                    color: '#fff4d6',
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    padding: '6px 9px',
                    border: '2px solid #1a1208',
                    boxShadow: '0 3px 0 rgba(0,0,0,0.35)',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    animation: 'lockedToastIn 0.18s ease-out',
                  }}
                >
                  Coming soon... Preparation is in the works
                </div>
              )}
            </div>
          </div>

          {!expanded && (
            <div style={{ fontSize: 10, color: '#7a5a36', marginTop: 4, letterSpacing: '0.05em' }}>
              ▸ click to open
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
