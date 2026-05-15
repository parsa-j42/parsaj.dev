// Pinned name + social bar. Lives at the top of the screen once the rising
// animations land. Its color flips dark-on-sky once the portfolio scene is up.

import { useState } from 'react';
import { SOCIALS } from '../../data/socials.js';
import { FONTS } from '../../theme.js';

function displayUrl(url) {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

export default function FixedHeader({ namePinned, linksPinned, inPortfolio }) {
  const onSky = inPortfolio;
  const nameColor   = onSky ? '#1d2b3a' : '#ffffff';
  const subColor    = onSky ? 'rgba(29,43,58,0.7)'  : 'rgba(220,235,255,0.78)';
  const linkColor   = onSky ? '#1d2b3a' : '#ffffff';
  const linkBg      = onSky ? 'rgba(255,255,255,0.55)' : 'rgba(15,20,40,0.45)';
  const linkBorder  = onSky ? 'rgba(29,43,58,0.25)'    : 'rgba(180,200,240,0.3)';
  const nameShadow  = onSky ? '2px 2px 0 rgba(255,255,255,0.5)' : '0 2px 14px rgba(0,0,0,0.6)';
  const subShadow   = onSky ? '1px 1px 0 rgba(255,255,255,0.6)' : 'none';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 28,
          left: 36,
          opacity: namePinned ? 1 : 0,
          transition: 'opacity 0.25s ease, color 0.6s ease',
          zIndex: 200,
          pointerEvents: 'none',
          color: nameColor,
          fontFamily: FONTS.pixel,
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: '0.5px', textShadow: nameShadow, lineHeight: 1.2 }}>
          PARSA JAFARI
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: subColor,
            fontFamily: FONTS.mono,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            textShadow: subShadow,
          }}
        >
          Software Developer
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          top: 32,
          right: 36,
          opacity: linksPinned ? 1 : 0,
          transition: 'opacity 0.25s ease, color 0.6s ease',
          zIndex: 200,
          display: 'flex',
          gap: 8,
        }}
      >
        {SOCIALS.map((s) => <SocialLink key={s.id} s={s} linkColor={linkColor} linkBg={linkBg} linkBorder={linkBorder} />)}
      </div>
    </>
  );
}

function SocialLink({ s, linkColor, linkBg, linkBorder }) {
  const [hover, setHover] = useState(false);
  const Ic = s.icon;
  const url = displayUrl(s.url);

  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        color: linkColor,
        background: linkBg,
        border: `1px solid ${linkBorder}`,
        borderRadius: 8,
        textDecoration: 'none',
        fontFamily: FONTS.mono,
        fontSize: 12,
        letterSpacing: '0.1em',
        backdropFilter: 'blur(8px)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, background 0.3s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <Ic />
      <span style={{ display: 'inline-block' }}>{s.label}</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: hover ? 200 : 0,
          marginLeft: hover ? 8 : 0,
          paddingLeft: hover ? 8 : 0,
          borderLeft: hover ? `1px solid ${linkBorder}` : '1px solid transparent',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 11.5,
          letterSpacing: '0.04em',
          textTransform: 'lowercase',
          opacity: hover ? 0.75 : 0,
          transition: hover
            ? 'max-width 0.7s linear, opacity 0.6s ease 0.1s, margin-left 0.7s linear, padding-left 0.7s linear, border-color 0.6s ease'
            : 'max-width 0.35s linear, opacity 0.25s ease, margin-left 0.35s linear, padding-left 0.35s linear, border-color 0.25s ease',
        }}
      >
        {url}
      </span>
    </a>
  );
}
