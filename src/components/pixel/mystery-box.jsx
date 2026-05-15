// The Mario-style "?" box that sits at the end of the spiral.
// Floats by default; shakes for ~600ms before bursting open.

import { PixelGrid } from './sprite.jsx';

const FRAME = [
  'WWWWWWWWWWWW',
  'WwwwwwwwwwwW',
  'Www......wwW',
  'Www.QQQQ.wwW',
  'Www.Q..Q.wwW',
  'Www....Q.wwW',
  'Www...Q..wwW',
  'Www..Q...wwW',
  'Www......wwW',
  'Www..Q...wwW',
  'Www......wwW',
  'WwwwwwwwwwwW',
  'WWWWWWWWWWWW',
];

const PALETTE = {
  W: '#1d1228',  // dark border
  w: '#f2c84b',  // gold body
  Q: '#1d1228',  // "?" mark
  '.': '#fff3c2', // light inner panel
};

export function MysteryBox({ scale = 6, shake = false, glow = true }) {
  return (
    <div
      style={{
        position: 'relative',
        animation: shake ? 'shake 0.15s infinite' : 'float 2.4s ease-in-out infinite',
        filter: glow ? 'drop-shadow(0 0 16px rgba(255, 220, 120, 0.65))' : 'none',
      }}
    >
      <PixelGrid grid={FRAME} palette={PALETTE} scale={scale} />
    </div>
  );
}
