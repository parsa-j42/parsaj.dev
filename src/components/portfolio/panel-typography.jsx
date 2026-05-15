// Tiny render helpers passed into the `body()` of every CLOUD_CONTENT and
// PROJECT_DETAILS entry. Centralizing them here means data files stay free of
// inline styling and look more like prose.
//
// All five (Section, P, Tag, Row, Job) are factory functions — they take the
// panel's `accent` color and return styled components keyed to that accent.

import React from 'react';
import { FONTS, INK } from '../../theme.js';

export function buildPanelComponents(accent) {
  const Section = ({ title }) => (
    <div
      style={{
        fontFamily: FONTS.pixel,
        fontSize: 13,
        color: accent,
        margin: '22px 0 10px 0',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        borderBottom: `2px dashed ${accent}55`,
        paddingBottom: 8,
      }}
    >
      {title}
    </div>
  );

  const P = ({ children, style }) => (
    <p
      style={{
        fontFamily: FONTS.mono,
        fontSize: 13,
        lineHeight: 1.75,
        color: INK.deep,
        margin: '0 0 12px 0',
        ...style,
      }}
    >
      {children}
    </p>
  );

  const Row = ({ children }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0 16px 0' }}>{children}</div>
  );

  const Tag = ({ children }) => (
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        padding: '5px 10px',
        background: '#ffffff',
        border: `1.5px solid ${accent}66`,
        color: INK.deep,
        borderRadius: 3,
        letterSpacing: '0.04em',
        boxShadow: `0 2px 0 ${accent}33`,
      }}
    >
      {children}
    </span>
  );

  const Job = ({ company, role, when, where, children }) => (
    <div
      style={{
        margin: '0 0 22px 0',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.6)',
        border: `1.5px solid ${accent}33`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 3,
      }}
    >
      <div style={{ fontFamily: FONTS.pixel, fontSize: 11, color: accent, letterSpacing: '0.5px', marginBottom: 4 }}>
        {company}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: INK.deep, marginBottom: 2 }}>
        {role}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#8a6a46', marginBottom: 10 }}>
        {when} · {where}
      </div>
      <div>{children}</div>
    </div>
  );

  return { Section, P, Tag, Row, Job };
}
