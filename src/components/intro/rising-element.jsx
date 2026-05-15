// Element that animates from a "spawn" point up to a pinned slot in the
// header. Holds the onArrived callback in a ref so re-renders from the parent
// (which happen every frame while the character walks) don't reset the tween.

import React from 'react';

export default function RisingElement({
  from,
  to,
  duration = 1200,
  onArrived,
  children,
  scale = 1,
}) {
  const [t, setT] = React.useState(0);
  const arrivedRef = React.useRef(false);
  const onArrivedRef = React.useRef(onArrived);
  React.useEffect(() => { onArrivedRef.current = onArrived; }, [onArrived]);

  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3); // cubic-out
      setT(eased);
      if (k < 1) raf = requestAnimationFrame(tick);
      else if (!arrivedRef.current) {
        arrivedRef.current = true;
        onArrivedRef.current && onArrivedRef.current();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const opacity = t < 0.05 ? t * 20 : 1;
  const sc = scale * (1 - t * 0.35);

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${sc})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 150,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}
