// Tiny shared tokens. Most of the styling here is inline (and dynamic), so this
// file only collects the strings that are repeated literally everywhere — fonts
// and the wood/paper palette used by the various pixel-style UI surfaces.

export const FONTS = {
  pixel: "'Press Start 2P', monospace",
  mono: "'JetBrains Mono', monospace",
};

// "Wood + paper" — the warm palette used by signs, banners, and panels.
export const INK = {
  paper: '#f4ebd1',
  paperLight: '#fdf4d4',
  deep: '#3a2a16',
  midDeep: '#4a3a26',
  wood: '#4f2e15',
  midWood: '#7a4a26',
  dimWood: '#a07246',
};

// Star palettes for the gravity-grid canvas.
export const STAR_PALETTES = {
  cosmic: ['#7df9ff', '#ff6ec7', '#b18cff', '#ffd166', '#ffffff', '#5cb8ff'],
  aurora: ['#7dffb6', '#5cf2e0', '#7fb3ff', '#c79dff', '#ffffff'],
  sunset: ['#ffb86b', '#ff6a8b', '#ffd166', '#ff8a3a', '#fff3c2', '#ffffff'],
  ember:  ['#ff4a4a', '#ff8a3a', '#ffd14a', '#ff6ec7', '#ffffff'],
  mono:   ['#ffffff', '#cfe1ff', '#e8efff'],
};
