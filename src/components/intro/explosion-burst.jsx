// Particle-burst that fires when the mystery box opens. 36 little squares
// shoot outward + a soft radial flash fades over ~1.2s. Self-contained — calls
// `onDone` once when the animation lands.

import React from 'react';

const PARTICLE_COUNT = 36;
const COLORS = ['#ffd14a', '#ff8a3a', '#fff3c2', '#f2c84b'];

export default function ExplosionBurst({ origin, onDone }) {
  const [t, setT] = React.useState(0);
  const onDoneRef = React.useRef(onDone);
  React.useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1200);
      setT(k);
      if (k < 1) raf = requestAnimationFrame(tick);
      else onDoneRef.current && onDoneRef.current();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const flashSize = 40 + t * 1200;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: origin.x - flashSize / 2,
          top: origin.y - flashSize / 2,
          width: flashSize,
          height: flashSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,200,${1 - t}) 0%, rgba(255,200,80,${0.5 * (1 - t)}) 30%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 175,
        }}
      />
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const ang = (i / PARTICLE_COUNT) * Math.PI * 2;
        const speed = 280 + (i % 5) * 40;
        const dx = Math.cos(ang) * speed * t;
        const dy = Math.sin(ang) * speed * t - 60 * t; // slight upward bias
        const size = 6 + (i % 4) * 2;
        const color = COLORS[i % COLORS.length];
        return (
          <div
            key={i}
            style={{
              position: 'fixed',
              left: origin.x + dx,
              top: origin.y + dy,
              width: size,
              height: size,
              background: color,
              opacity: 1 - t,
              transform: `rotate(${i * 30 + t * 360}deg)`,
              boxShadow: `0 0 ${6 * (1 - t)}px ${color}`,
              pointerEvents: 'none',
              zIndex: 180,
            }}
          />
        );
      })}
    </>
  );
}
