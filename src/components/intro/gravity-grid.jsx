// Star field rendered into a single full-screen <canvas>.
//
// Why canvas and not SVG: at the default density (~700 stars) plus three glow
// passes per star, an SVG tree of that size kills frame rate on mid-range
// laptops. Canvas batches it into one paint per frame.
//
// The mouse acts as a moving "gravity well" - depending on `interaction`, stars
// either pull toward it, push away from it, or swirl around it. On `exploding`,
// the field is blasted outward from the screen center over ~1s, then fades.

import React from 'react';
import { STAR_PALETTES } from '../../theme.js';

export default function GravityGrid({ exploding = false, fadeOut = false, tweaks = {} }) {
  const {
    palette = 'cosmic',
    starDensity = 180,
    mouseStrength = 80,
    interaction = 'attract', // attract | repel | swirl
    showGrid = true,
    twinkle = true,
  } = tweaks;

  const canvasRef = React.useRef(null);
  const tweaksRef = React.useRef(tweaks);
  React.useEffect(() => {
    tweaksRef.current = { palette, starDensity, mouseStrength, interaction, showGrid, twinkle };
  }, [palette, starDensity, mouseStrength, interaction, showGrid, twinkle]);

  // All animation state is held in a ref so React re-renders don't reset it.
  const state = React.useRef({
    t0: performance.now(),
    explodeStart: 0,
    fadeOutStart: 0,
    raf: 0,
    mouse: { x: 0, y: 0, has: false },
    smoothMouse: { x: 0, y: 0 },
    stars: [],
    starsKey: '',
  });

  React.useEffect(() => {
    if (exploding && !state.current.explodeStart) {
      state.current.explodeStart = performance.now();
    }
  }, [exploding]);

  React.useEffect(() => {
    if (fadeOut && !state.current.fadeOutStart) {
      state.current.fadeOutStart = performance.now();
    }
  }, [fadeOut]);

  const buildStars = React.useCallback((count, W, H) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * W,
        y: Math.random() * H,
        baseSize: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 2.4,
        colorIdx: Math.floor(Math.random() * 6),
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        depth: 0.3 + Math.random() * 0.9, // affects how strongly the star reacts
      });
    }
    state.current.stars = arr;
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    state.current.smoothMouse.x = window.innerWidth / 2;
    state.current.smoothMouse.y = window.innerHeight / 2;
    state.current.mouse.x = window.innerWidth / 2;
    state.current.mouse.y = window.innerHeight / 2;

    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      state.current.mouse.x = x;
      state.current.mouse.y = y;
      state.current.mouse.has = true;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    buildStars(tweaksRef.current.starDensity, window.innerWidth, window.innerHeight);
    state.current.starsKey = String(tweaksRef.current.starDensity);

    const draw = () => {
      const now = performance.now();
      const t = (now - state.current.t0) / 1000;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const tw = tweaksRef.current;

      // rebuild stars if density changed live
      const wantKey = String(tw.starDensity);
      if (wantKey !== state.current.starsKey) {
        buildStars(tw.starDensity, W, H);
        state.current.starsKey = wantKey;
      }

      const m = state.current.mouse;
      const sm = state.current.smoothMouse;
      sm.x += (m.x - sm.x) * 0.12;
      sm.y += (m.y - sm.y) * 0.12;

      // Loading flicker - a deliberately uneven fade-in for the first ~3s.
      let opacity;
      if (t < 0.4) opacity = 0;
      else {
        const base = Math.min(1, (t - 0.4) / 3.2);
        const flicker =
          (Math.sin(t * 11.3) * 0.5 + Math.sin(t * 5.1 + 1.4) * 0.5) * 0.35 * (1 - base);
        opacity = Math.max(0, Math.min(1, base + flicker));
        if (t < 2.5 && Math.sin(t * 17 + Math.cos(t * 3)) > 0.92) opacity *= 0.3;
      }

      let explodeT = 0;
      if (state.current.explodeStart) {
        explodeT = (now - state.current.explodeStart) / 1000;
      }
      const cellExpand = 1 + Math.pow(explodeT, 2.4) * 8;
      const wellActive = explodeT > 0 ? Math.max(0, 1 - explodeT * 1.4) : 1;

      if (state.current.fadeOutStart) {
        const k = (now - state.current.fadeOutStart) / 700;
        opacity *= Math.max(0, 1 - k);
      }

      // background
      ctx.fillStyle = '#050616';
      ctx.fillRect(0, 0, W, H);

      // Optional grid lines, also distorted by the mouse well.
      if (tw.showGrid) {
        const cell = 80 * cellExpand;
        const wellStrength = tw.mouseStrength * wellActive * (tw.interaction === 'repel' ? -0.55 : 1);
        const cx = sm.x;
        const cy = sm.y;
        const distort = (x, y) => {
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy) + 1;
          const pull = (wellStrength * 110) / (d + 60);
          const factor = 1 - pull / d;
          return [cx + dx * factor, cy + dy * factor];
        };

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(120, 150, 220, ${0.22 * opacity})`;
        for (let yy = -cell * 4; yy < H + cell * 4; yy += cell) {
          ctx.beginPath();
          let first = true;
          for (let xx = -cell * 2; xx <= W + cell * 2; xx += cell / 6) {
            const [px, py] = distort(xx, yy);
            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        for (let xx = -cell * 4; xx < W + cell * 4; xx += cell) {
          ctx.beginPath();
          let first = true;
          for (let yy = -cell * 2; yy <= H + cell * 2; yy += cell / 6) {
            const [px, py] = distort(xx, yy);
            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // Soft halo around the cursor - colored by interaction mode.
      if (wellActive > 0 && opacity > 0.05) {
        const grad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, 280);
        const tone =
          tw.interaction === 'repel' ? '255, 110, 199'
          : tw.interaction === 'swirl' ? '180, 140, 255'
          : '125, 249, 255';
        grad.addColorStop(0, `rgba(${tone}, ${0.22 * opacity * wellActive})`);
        grad.addColorStop(0.45, `rgba(${tone}, ${0.06 * opacity * wellActive})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Stars - three passes per star: wide halo, mid glow, bright core.
      const palette2 = STAR_PALETTES[tw.palette] || STAR_PALETTES.cosmic;
      const stars = state.current.stars;
      const explodeBlast =
        explodeT > 0 ? Math.min(1, explodeT * 1.4) * 1400 * Math.pow(explodeT, 1.6) : 0;

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = W + 10;
        if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10;
        if (s.y > H + 10) s.y = -10;

        const dx = s.x - sm.x;
        const dy = s.y - sm.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.5;
        const influence = Math.max(0, 1 - d / 340) * s.depth * wellActive;
        let ox = 0, oy = 0;
        if (influence > 0 && tw.mouseStrength > 0) {
          const f = tw.mouseStrength * influence * 0.55;
          if (tw.interaction === 'repel') {
            ox =  (dx / d) * f;
            oy =  (dy / d) * f;
          } else if (tw.interaction === 'swirl') {
            ox = (-dy / d) * f * 1.1;
            oy =  (dx / d) * f * 1.1;
          } else {
            ox = -(dx / d) * f;
            oy = -(dy / d) * f;
          }
        }

        // Outward blast on explode
        let ex = 0, ey = 0;
        if (explodeBlast > 0) {
          const ccx = W / 2;
          const ccy = H / 2;
          const ddx = s.x - ccx;
          const ddy = s.y - ccy;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy) + 1;
          const blast = explodeBlast / (dd + 30);
          ex = (ddx / dd) * blast;
          ey = (ddy / dd) * blast;
        }

        const px = s.x + ox + ex;
        const py = s.y + oy + ey;

        const tw_ = tw.twinkle ? 0.55 + 0.45 * Math.sin(t * s.speed + s.phase) : 0.85;
        const glowBoost = 1 + influence * 1.6;
        const sizeBoost = 1 + influence * 0.8;
        const size = s.baseSize * sizeBoost;
        const color = palette2[s.colorIdx % palette2.length];
        const alpha = Math.max(0, Math.min(1, tw_ * opacity * (1 - explodeT * 0.6)));

        // wide soft halo - the "blur" illusion
        ctx.fillStyle = hexWithAlpha(color, alpha * 0.28 * glowBoost);
        ctx.beginPath();
        ctx.arc(px, py, size * 8, 0, Math.PI * 2);
        ctx.fill();
        // mid glow
        ctx.fillStyle = hexWithAlpha(color, alpha * 0.55 * glowBoost);
        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx.fill();
        // tiny bright core
        ctx.fillStyle = hexWithAlpha('#ffffff', alpha * 0.9);
        ctx.beginPath();
        ctx.arc(px, py, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      state.current.raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(state.current.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [buildStars]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

function hexWithAlpha(hex, a) {
  if (hex[0] !== '#') return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
}
