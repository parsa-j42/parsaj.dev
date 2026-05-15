// Pinned name + social bar. Lives at the top of the screen once the rising
// animations land. Its color flips dark-on-sky once the portfolio scene is up.
//
// Two layouts:
//   desktop - full pills with hover-reveal URL strip
//   mobile  - compact icon-only pills, no hover reveal (taps are taps)

import { useState } from 'react';
import { SOCIALS } from '../../data/socials.js';
import { FONTS } from '../../theme.js';
import useIsMobile from '../../hooks/use-is-mobile.js';

function displayUrl(url) {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

export default function FixedHeader({ namePinned, linksPinned, inPortfolio }) {
  const isMobile = useIsMobile();
  const onSky = inPortfolio;

  const nameColor   = onSky ? '#1d2b3a' : '#ffffff';
  const subColor    = onSky ? 'rgba(29,43,58,0.7)'  : 'rgba(220,235,255,0.78)';
  const linkColor   = onSky ? '#1d2b3a' : '#ffffff';
  const linkBg      = onSky ? 'rgba(255,255,255,0.55)' : 'rgba(15,20,40,0.45)';
  const linkBorder  = onSky ? 'rgba(29,43,58,0.25)'    : 'rgba(180,200,240,0.3)';
  const nameShadow  = onSky ? '2px 2px 0 rgba(255,255,255,0.5)' : '0 2px 14px rgba(0,0,0,0.6)';
  const subShadow   = onSky ? '1px 1px 0 rgba(255,255,255,0.6)' : 'none';

  // Compact metrics for phones; the desktop side keeps its original spacing.
  const m = isMobile
    ? { padX: 14, nameTop: 14, linksTop: 16, nameSize: 15, subSize: 8.5, subGap: 4, gap: 6 }
    : { padX: 36, nameTop: 28, linksTop: 32, nameSize: 22, subSize: 11,  subGap: 8, gap: 8 };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: m.nameTop,
          left: m.padX,
          opacity: namePinned ? 1 : 0,
          transition: 'opacity 0.25s ease, color 0.6s ease',
          zIndex: 200,
          pointerEvents: 'none',
          color: nameColor,
          fontFamily: FONTS.pixel,
        }}
      >
        <div style={{ fontSize: m.nameSize, letterSpacing: '0.5px', textShadow: nameShadow, lineHeight: 1.2 }}>
          PARSA JAFARI
        </div>
        <div
          style={{
            marginTop: m.subGap,
            fontSize: m.subSize,
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
          top: m.linksTop,
          right: m.padX,
          opacity: linksPinned ? 1 : 0,
          transition: 'opacity 0.25s ease, color 0.6s ease',
          zIndex: 200,
          display: 'flex',
          gap: m.gap,
        }}
      >
        {SOCIALS.map((s) => (
          <SocialLink
            key={s.id}
            s={s}
            linkColor={linkColor}
            linkBg={linkBg}
            linkBorder={linkBorder}
            isMobile={isMobile}
          />
        ))}
      </div>
    </>
  );
}

function SocialLink({ s, linkColor, linkBg, linkBorder, isMobile }) {
  const Ic = s.icon;

  if (isMobile) {
    // Icon-only square. No hover state because phones do not hover; the URL
    // would just steal width anyway.
    return (
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.label}
        title={s.label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          color: linkColor,
          background: linkBg,
          border: `1px solid ${linkBorder}`,
          borderRadius: 8,
          textDecoration: 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Ic />
      </a>
    );
  }

  return <DesktopSocialLink s={s} linkColor={linkColor} linkBg={linkBg} linkBorder={linkBorder} />;
}

function DesktopSocialLink({ s, linkColor, linkBg, linkBorder }) {
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
