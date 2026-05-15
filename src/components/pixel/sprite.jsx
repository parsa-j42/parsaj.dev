// PixelGrid - the one true SVG-from-string-grid renderer used by every pixel
// sprite in this project (character, mystery box, trees, mushrooms, etc).
//
// `grid` is an array of equal-length strings; each character is a key into
// `palette` that resolves to a fill color. Spaces / unknown chars render as
// transparent (i.e. nothing is drawn).
//
// `extraHeight` lets sprites reserve room for a shadow ellipse passed via
// children - handy for the character, which has a soft blob underneath.

export function PixelGrid({
  grid,
  palette,
  scale = 3,
  style,
  children,
  extraHeight = 0,
}) {
  const cols = grid[0].length;
  const rows = grid.length;
  const w = cols * scale;
  const h = rows * scale + extraHeight;

  const rects = [];
  for (let y = 0; y < rows; y++) {
    const row = grid[y];
    for (let x = 0; x < cols; x++) {
      const fill = palette[row[x]];
      if (!fill) continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * scale}
          y={y * scale}
          width={scale}
          height={scale}
          fill={fill}
          shapeRendering="crispEdges"
        />,
      );
    }
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      {children}
      {rects}
    </svg>
  );
}
