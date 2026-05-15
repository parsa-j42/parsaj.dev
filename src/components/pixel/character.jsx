// Pixel adventurer - drawn as a 14×20 character grid. Frames cover idle, two
// walk steps, and a "looking up" frame used when a milestone is revealed.

import { PixelGrid } from './sprite.jsx';

const PALETTE = {
  T: '#c1543a', // hat top
  B: '#6a2a1c', // hat band
  H: '#3a2618', // hair
  K: '#f4c19c', // skin
  k: '#d99a72', // skin shade
  S: '#3b7ac7', // shirt
  s: '#27579a', // shirt shade
  P: '#2a2a3a', // pants
  p: '#181826', // pants shade
  O: '#3d2614', // boots
  E: '#0a0a1a', // eye
  C: '#e98a78', // cheek
};

const FRAMES = {
  idle: [
    '....TTTTTT....',
    '...TTTTTTTT...',
    '..TTTTTTTTTT..',
    '..BBBBBBBBBB..',
    '...HKKKKKKH...',
    '...HKEKKEKH...',
    '...kKKKKKKk...',
    '...kKKCCKKk...',
    '....kKKKKk....',
    '...SSSSSSSS...',
    '..SSSSSSSSSS..',
    '.SSsSSSSSSsSS.',
    '.SsSSSSSSSSsS.',
    '..SSSSSSSSSS..',
    '..KKSSSSSSKK..',
    '..KKPPPPPPKK..',
    '...PPPPPPPP...',
    '...PpPPPPpP...',
    '...PPPPPPPP...',
    '...OOO..OOO...',
  ],
  walkA: [
    '....TTTTTT....',
    '...TTTTTTTT...',
    '..TTTTTTTTTT..',
    '..BBBBBBBBBB..',
    '...HKKKKKKH...',
    '...HKEKKEKH...',
    '...kKKKKKKk...',
    '...kKKCCKKk...',
    '....kKKKKk....',
    '...SSSSSSSS...',
    '..SSSSSSSSSS..',
    '.KSsSSSSSSsSK.',
    '.KsSSSSSSSSsK.',
    '..SSSSSSSSSS..',
    '...SSSSSSSS...',
    '...PPPPPPPP...',
    '..PPPP..PPPP..',
    '..PpPP..PPpP..',
    '..PPPP..PPPP..',
    '..OOO....OOO..',
  ],
  walkB: [
    '....TTTTTT....',
    '...TTTTTTTT...',
    '..TTTTTTTTTT..',
    '..BBBBBBBBBB..',
    '...HKKKKKKH...',
    '...HKEKKEKH...',
    '...kKKKKKKk...',
    '...kKKCCKKk...',
    '....kKKKKk....',
    '...SSSSSSSS...',
    '..SSSSSSSSSS..',
    '.SSsSSSSSSsSS.',
    '.SsSSSSSSSSsS.',
    '..SSSSSSSSSS..',
    '..KKSSSSSSKK..',
    '..KPPPPPPPPK..',
    '...PPP..PPP...',
    '...PpP..PpP...',
    '..PPPP..PPPP..',
    '..OOOO..OOOO..',
  ],
  lookUp: [
    '....TTTTTT....',
    '....TTTTTT....',
    '...TTTTTTTT...',
    '..TTTTTTTTTT..',
    '..BBBBBBBBBB..',
    '...HKEKKEKH...',
    '...HKKKKKKH...',
    '...kKKKKKKk...',
    '....kKKKKk....',
    '...SSSSSSSS...',
    '..SSSSSSSSSS..',
    '.SSsSSSSSSsSS.',
    '.SsSSSSSSSSsS.',
    '..SSSSSSSSSS..',
    '..KKSSSSSSKK..',
    '..KKPPPPPPKK..',
    '...PPPPPPPP...',
    '...PpPPPPpP...',
    '...PPPPPPPP...',
    '...OOO..OOO...',
  ],
};

export function Character({ frame = 'idle', scale = 4, flip = false, shadow = true }) {
  const grid = FRAMES[frame] || FRAMES.idle;
  const cols = grid[0].length;
  const rows = grid.length;
  const w = cols * scale;
  const h = rows * scale;

  return (
    <PixelGrid
      grid={grid}
      palette={PALETTE}
      scale={scale}
      extraHeight={shadow ? scale * 2 : 0}
      style={{
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      {shadow && (
        <ellipse
          cx={w / 2}
          cy={h + scale * 0.6}
          rx={w * 0.32}
          ry={scale * 0.7}
          fill="rgba(0,0,0,0.35)"
        />
      )}
    </PixelGrid>
  );
}
