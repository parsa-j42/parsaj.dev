// The spiral the player walks along. Path is sampled into ~480 points; star
// "trail" markers are placed every 14px along it. The character moves along
// the parametric arc length (not raw theta) so motion feels even.
//
// Three milestones along the path trigger reveals back up to App:
//    0.32 → name reveal
//    0.66 → links reveal
//    0.985 → mystery box reached → opens after a short shake

import React from 'react';
import { Character } from '../pixel/character.jsx';
import { MysteryBox } from '../pixel/mystery-box.jsx';

const STAR_SPACING = 14;
const TURNS = 2.5;

export default function SpiralScene({
  progress,
  setProgress,
  active,
  onNameReveal,
  onLinksReveal,
  onBoxOpen,
  walkSpeed = 0.085,
}) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [dims, setDims] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  const [holding, setHolding] = React.useState(false);
  const [lookUp, setLookUp] = React.useState(false);
  const [boxOpening, setBoxOpening] = React.useState(false);

  React.useEffect(() => {
    const r = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  // Geometry — sample the spiral into points, build cumulative arc length, then
  // place star markers along it at fixed spacing.
  const { points, cumLen, totalLen, stars, endPoint } = React.useMemo(() => {
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    const maxR = Math.min(dims.w, dims.h) * 0.32;
    const totalTheta = TURNS * 2 * Math.PI;
    const a = maxR / totalTheta;

    const steps = 480;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const theta = (1 - u) * totalTheta;
      const r = a * theta;
      const x = cx + r * Math.cos(theta + Math.PI / 2);
      const y = cy + r * Math.sin(theta + Math.PI / 2);
      pts.push([x, y]);
    }

    const cl = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0];
      const dy = pts[i][1] - pts[i - 1][1];
      cl.push(cl[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    const total = cl[cl.length - 1];

    // walk the path at fixed spacing, sampling stars as we go
    const starList = [];
    let target = 0;
    let idx = 1;
    let id = 0;
    while (target <= total) {
      while (idx < cl.length && cl[idx] < target) idx++;
      const t = (target - cl[idx - 1]) / Math.max(0.001, cl[idx] - cl[idx - 1]);
      const x = pts[idx - 1][0] + (pts[idx][0] - pts[idx - 1][0]) * t;
      const y = pts[idx - 1][1] + (pts[idx][1] - pts[idx - 1][1]) * t;
      const nx = pts[idx][1] - pts[idx - 1][1];
      const ny = -(pts[idx][0] - pts[idx - 1][0]);
      const nlen = Math.sqrt(nx * nx + ny * ny) + 0.001;
      const jitter = Math.sin(id * 1.317) * Math.cos(id * 0.713) * 2.0;
      starList.push({
        x: x + (nx / nlen) * jitter,
        y: y + (ny / nlen) * jitter,
        arc: target,
        size: 1.0 + (((id * 37) % 100) / 100) * 1.8 + (id % 11 === 0 ? 1.6 : 0),
        phase: (id * 0.583) % (Math.PI * 2),
        speed: 1.5 + (((id * 13) % 100) / 100) * 2.0,
      });
      target += STAR_SPACING;
      id++;
    }

    return { points: pts, cumLen: cl, totalLen: total, stars: starList, endPoint: pts[pts.length - 1] };
  }, [dims]);

  // Binary search by arc length → world position + tangent angle.
  const positionAt = React.useCallback(
    (p) => {
      const target = Math.max(0, Math.min(1, p)) * totalLen;
      let lo = 0;
      let hi = cumLen.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cumLen[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const idx = Math.max(1, lo);
      const t = (target - cumLen[idx - 1]) / Math.max(0.001, cumLen[idx] - cumLen[idx - 1]);
      const [x1, y1] = points[idx - 1];
      const [x2, y2] = points[idx];
      return {
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
        angle: Math.atan2(y2 - y1, x2 - x1),
      };
    },
    [points, cumLen, totalLen],
  );

  const progressRef = React.useRef(progress);
  React.useEffect(() => { progressRef.current = progress; }, [progress]);

  // Walk loop — only ticks while the user holds the mouse/touch down.
  React.useEffect(() => {
    if (!holding || !active) return;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((p) => Math.min(1, p + dt * walkSpeed));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding, active, setProgress, walkSpeed]);

  // Milestone triggers — fire once each, in order.
  const triggeredRef = React.useRef({ name: false, links: false, box: false });
  React.useEffect(() => {
    const charPos = positionAt(progress);
    if (!triggeredRef.current.name && progress >= 0.32) {
      triggeredRef.current.name = true;
      setLookUp(true);
      onNameReveal({ x: charPos.x, y: charPos.y });
      setTimeout(() => setLookUp(false), 1400);
    }
    if (!triggeredRef.current.links && progress >= 0.66) {
      triggeredRef.current.links = true;
      setLookUp(true);
      onLinksReveal({ x: charPos.x, y: charPos.y });
      setTimeout(() => setLookUp(false), 1400);
    }
    if (!triggeredRef.current.box && progress >= 0.985) {
      triggeredRef.current.box = true;
      setTimeout(() => setBoxOpening(true), 600);
      setTimeout(() => onBoxOpen(), 1700);
    }
  }, [progress, positionAt, onNameReveal, onLinksReveal, onBoxOpen]);

  // Hold-to-walk pointer events.
  React.useEffect(() => {
    if (!active) return;
    const down = () => setHolding(true);
    const up = () => setHolding(false);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchstart', down);
      window.removeEventListener('touchend', up);
    };
  }, [active]);

  // Two-frame walk cycle.
  const [walkFrame, setWalkFrame] = React.useState('idle');
  React.useEffect(() => {
    if (!holding) {
      setWalkFrame('idle');
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % 2;
      setWalkFrame(i === 0 ? 'walkA' : 'walkB');
    }, 180);
    return () => clearInterval(iv);
  }, [holding]);

  // Star canvas — re-drawn each frame so star twinkle reads cleanly.
  // Stars ahead of the walker are full opacity; ones just behind fade out
  // over 60px; the rest are skipped.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width = dims.w + 'px';
    canvas.style.height = dims.h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf;
    const start = performance.now();
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, dims.w, dims.h);

      const walked = progressRef.current * totalLen;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const ahead = s.arc > walked;
        const dist = s.arc - walked;
        let alpha;
        if (ahead) {
          alpha = 1.0;
        } else if (dist > -60) {
          alpha = Math.max(0, (dist + 60) / 60);
        } else {
          continue;
        }
        const twk = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const a = alpha * twk;
        ctx.fillStyle = `rgba(220, 235, 255, ${0.28 * a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.55, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [dims, stars, totalLen]);

  const charPos = positionAt(progress);
  const charFrame = lookUp ? 'lookUp' : holding ? walkFrame : 'idle';
  const flip = Math.cos(charPos.angle) < 0;
  const hintOpacity = progress < 0.02 ? 1 : Math.max(0, 1 - progress * 8);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: active ? 'auto' : 'none',
        cursor: holding ? 'grabbing' : 'grab',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* tiny golden marker dot at the box position */}
      <svg
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        <circle cx={endPoint[0]} cy={endPoint[1]} r={3} fill="rgba(255,220,120,0.9)" />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: endPoint[0],
          top: endPoint[1],
          transform: 'translate(-50%, calc(-100% + 12px))',
          transition: 'opacity 0.3s ease',
        }}
      >
        <MysteryBox scale={4} shake={boxOpening} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: charPos.x,
          top: charPos.y,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
          transition: holding ? 'none' : 'transform 0.2s',
        }}
      >
        <Character frame={charFrame} scale={3} flip={flip} />
      </div>

      <HoldHint opacity={hintOpacity} />
    </div>
  );
}

function HoldHint({ opacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transition: 'opacity 0.5s ease',
        color: 'rgba(220,235,255,0.85)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 18px',
          border: '1px solid rgba(180,200,240,0.35)',
          borderRadius: 999,
          background: 'rgba(15,20,40,0.45)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: '#9ec3ff',
            animation: 'blink 1.6s infinite',
          }}
        />
        Hold click to walk
      </span>
    </div>
  );
}
