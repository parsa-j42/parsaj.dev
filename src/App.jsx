// Top-level orchestrator. Drives the four phases:
//
//   intro     ─ first ~2.2s - star field is fading in, nothing else
//   spiral    ─ user holds to walk along the spiral; passes 3 milestones
//   exploding ─ mystery box opens, white flash, portfolio crossfades in
//   portfolio ─ pastoral landing scene
//
// State that needs to live up here (and not in a child) is anything two
// children touch - phase, walk progress, the rising-element targets, and
// the white-flash / portfolio cross-fade timing.

import React from 'react';

import GravityGrid from './components/intro/gravity-grid.jsx';
import SpiralScene from './components/intro/spiral-scene.jsx';
import RisingElement from './components/intro/rising-element.jsx';
import ExplosionBurst from './components/intro/explosion-burst.jsx';
import FixedHeader from './components/header/fixed-header.jsx';
import PortfolioScene from './components/portfolio/portfolio-scene.jsx';

import { SOCIALS } from './data/socials.js';
import { VISUALS } from './config.js';
import { FONTS } from './theme.js';
import useIsMobile from './hooks/use-is-mobile.js';

const { useState, useEffect, useCallback } = React;

export default function App() {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState('intro');
  const [progress, setProgress] = useState(0);

  // rising-text reveals
  const [risingName, setRisingName]   = useState(null);
  const [risingLinks, setRisingLinks] = useState(null);
  const [namePinned, setNamePinned]   = useState(false);
  const [linksPinned, setLinksPinned] = useState(false);

  // explode → portfolio cross-fade
  const [explodePos, setExplodePos] = useState(null);
  const [exploding, setExploding] = useState(false);
  const [burstDone, setBurstDone] = useState(false);
  const [whiteFade, setWhiteFade] = useState(0);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [gridFadeOut, setGridFadeOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('spiral'), 2200);
    return () => clearTimeout(t);
  }, []);

  // Pinned header slot positions (the rising text/links land here). Mobile
  // uses the compact header geometry from FixedHeader so the rise lands flush.
  const nameTarget  = isMobile
    ? { x: 14 + 75, y: 14 + 18 }
    : { x: 36 + 130, y: 28 + 22 };
  const linksTarget = isMobile
    ? { x: window.innerWidth - 14 - 80, y: 16 + 17 }
    : { x: window.innerWidth - 36 - 280, y: 32 + 20 };

  const onNameReveal  = useCallback((pos) => setRisingName({ from: { x: pos.x, y: pos.y - 40 } }), []);
  const onLinksReveal = useCallback((pos) => setRisingLinks({ from: { x: pos.x, y: pos.y - 40 } }), []);

  // box-open transition: white flash in → swap to portfolio → fade flash out
  const onBoxOpen = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setExplodePos({ x: cx, y: cy });
    setExploding(true);
    setPhase('exploding');

    let s = performance.now();
    const fadeIn = () => {
      const k = Math.min(1, (performance.now() - s) / 700);
      setWhiteFade(k);
      if (k < 1) requestAnimationFrame(fadeIn);
      else {
        setPortfolioVisible(true);
        setGridFadeOut(true);
        setTimeout(() => {
          let s2 = performance.now();
          const fadeOut = () => {
            const k2 = Math.min(1, (performance.now() - s2) / 1100);
            setWhiteFade(1 - k2);
            if (k2 < 1) requestAnimationFrame(fadeOut);
            else setPhase('portfolio');
          };
          fadeOut();
        }, 350);
      }
    };
    fadeIn();
  }, []);

  const inPortfolio = phase === 'portfolio' || (phase === 'exploding' && portfolioVisible);

  const gravityTweaks = {
    palette: VISUALS.starPalette,
    starDensity: VISUALS.starDensity,
    mouseStrength: VISUALS.mouseStrength,
    interaction: VISUALS.interaction,
    showGrid: VISUALS.showGrid,
    twinkle: VISUALS.twinkle,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* keep the star field rendered until the white flash has eaten the screen */}
      {(!inPortfolio || whiteFade > 0.1) && (
        <GravityGrid exploding={exploding} fadeOut={gridFadeOut} tweaks={gravityTweaks} />
      )}

      {(phase === 'spiral' || phase === 'exploding') && !portfolioVisible && (
        <div
          style={{
            opacity: phase === 'exploding' ? Math.max(0, 1 - whiteFade * 1.3) : 1,
            transition: 'opacity 0.3s',
            position: 'absolute',
            inset: 0,
          }}
        >
          <SpiralScene
            progress={progress}
            setProgress={setProgress}
            active={phase === 'spiral'}
            onNameReveal={onNameReveal}
            onLinksReveal={onLinksReveal}
            onBoxOpen={onBoxOpen}
            walkSpeed={VISUALS.walkSpeed}
          />
        </div>
      )}

      <PortfolioScene visible={portfolioVisible} />

      {risingName && !namePinned && (
        <RisingElement
          from={risingName.from}
          to={nameTarget}
          duration={1300}
          onArrived={() => setNamePinned(true)}
        >
          <RisingNameLabel isMobile={isMobile} />
        </RisingElement>
      )}

      {risingLinks && !linksPinned && (
        <RisingElement
          from={risingLinks.from}
          to={linksTarget}
          duration={1300}
          onArrived={() => setLinksPinned(true)}
        >
          <RisingLinksRow isMobile={isMobile} />
        </RisingElement>
      )}

      <FixedHeader namePinned={namePinned} linksPinned={linksPinned} inPortfolio={inPortfolio} />

      {exploding && explodePos && !burstDone && (
        <ExplosionBurst origin={explodePos} onDone={() => setBurstDone(true)} />
      )}

      {/* full-screen white wash for the explosion → portfolio transition */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          opacity: whiteFade,
          pointerEvents: 'none',
          zIndex: 250,
        }}
      />
    </div>
  );
}

// ── Rising-text payloads - only used here, kept inline ────────────────────

function RisingNameLabel({ isMobile }) {
  return (
    <div
      style={{
        fontFamily: FONTS.pixel,
        color: '#fff',
        textAlign: 'center',
        textShadow: '0 0 16px rgba(150,200,255,0.6), 0 2px 12px rgba(0,0,0,0.8)',
      }}
    >
      <div style={{ fontSize: isMobile ? 18 : 26, letterSpacing: '1px' }}>PARSA JAFARI</div>
      <div
        style={{
          marginTop: isMobile ? 6 : 10,
          fontSize: isMobile ? 9 : 12,
          fontFamily: FONTS.mono,
          letterSpacing: '0.3em',
          color: '#c8d8ff',
        }}
      >
        SOFTWARE DEVELOPER
      </div>
    </div>
  );
}

function RisingLinksRow({ isMobile }) {
  return (
    <div style={{ display: 'flex', gap: isMobile ? 6 : 10, color: '#fff' }}>
      {SOCIALS.map((s) => {
        const Ic = s.icon;
        // On mobile we preview the same icon-only square that pins in the header.
        if (isMobile) {
          return (
            <div
              key={s.id}
              style={{
                width: 34,
                height: 34,
                background: 'rgba(15,20,40,0.55)',
                border: '1px solid rgba(180,200,240,0.4)',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(150,200,255,0.4)',
              }}
            >
              <Ic />
            </div>
          );
        }
        return (
          <div
            key={s.id}
            style={{
              padding: '10px 14px',
              background: 'rgba(15,20,40,0.55)',
              border: '1px solid rgba(180,200,240,0.4)',
              borderRadius: 8,
              fontFamily: FONTS.mono,
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: '0.1em',
              boxShadow: '0 0 18px rgba(150,200,255,0.4)',
            }}
          >
            <Ic /> {s.label}
          </div>
        );
      })}
    </div>
  );
}
