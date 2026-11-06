// The room, as one continuous line. Coordinates are the hero image's pixels (2000 × 1120)
// shifted so the image centre is (0,0): world = image - (1000, 560). y points down.
// The pen enters from the right edge (Hebrew reads right to left) and ends in the butterfly.
// Connectors between parts fall off-frame (x < 0 or y < 0 in image pixels) so the final picture has no stray lines.
import { mulberry } from '/core/lib.js';

const O = [1000, 560];
const rnd = mulberry(1206);
const w = ([x, y]) => [x - O[0], y - O[1]];
const f = v => v.toFixed(1);
// a hand-drawn straight line: each span bows a little, like a line pulled by hand without a ruler
const poly = pts => {
  const q = pts.map(w); let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 1; i < q.length; i++) {
    const [ax, ay] = q[i - 1], [bx, by] = q[i], L = Math.hypot(bx - ax, by - ay) || 1;
    const bow = (rnd() - 0.5) * Math.min(L * 0.035, 14);
    const cx = (ax + bx) / 2 - (by - ay) / L * bow, cy = (ay + by) / 2 + (bx - ax) / L * bow;
    d += ` Q${f(cx)},${f(cy)} ${f(bx)},${f(by)}`;
  }
  return d;
};
const at = (x, y) => w([x, y]).map(f).join(',');

// Lnet's one-line butterfly in a 60 × 40 box: four wings round the body, a body stroke, two antennae
const FLY = 'M30 22 C24 8 10 0 5 7 C0 14 10 22 30 22 C16 24 9 32 13 37 C17 41 27 33 30 22 C33 33 43 41 47 37 C51 32 44 24 30 22 C50 22 60 14 55 7 C50 0 36 8 30 22 L30 29 L30 22 C29 14 27 9 23 4 C27 9 29 14 30 22 C31 14 33 9 37 4';
const S = 7.2;

export const SEGS = [
  { // shelves, entering at speed from the right edge, then up the post
    id: 'shelves', style: 'room', t: [0.15, 1.2], slowK: 1.4, parts: [
      { d: poly([[2090, 548], [1585, 548], [1585, 412], [1760, 404], [1760, 186]]) },
    ] },
  { // right lamp: rim, left side up, cord to the ceiling and back, right side down, rim back
    id: 'lampR', style: 'room', t: [1.2, 2.05], parts: [
      { d: `M${at(1760, 186)} L${at(1580, 186)} C${at(1585, 150)} ${at(1615, 104)} ${at(1690, 95)} L${at(1690, -40)} L${at(1690, 95)} C${at(1765, 104)} ${at(1795, 150)} ${at(1798, 186)} L${at(1580, 186)}` },
    ] },
  { // ceiling beam, right to left
    id: 'beam', style: 'room', t: [2.05, 2.55], slowK: 0.8, parts: [
      { d: poly([[1580, 186], [1500, 180], [845, 186], [700, 190], [700, 234]]) },
    ] },
  { // left lamp, leaving through the ceiling
    id: 'lampL', style: 'room', t: [2.55, 3.2], parts: [
      { d: `M${at(700, 234)} L${at(520, 234)} C${at(528, 190)} ${at(560, 160)} ${at(610, 148)} C${at(660, 160)} ${at(692, 190)} ${at(700, 234)} L${at(700, 230)} C${at(692, 190)} ${at(660, 160)} ${at(610, 148)} L${at(610, -40)}` },
    ] },
  { // window wall: frame, a small skyline between the mullions, the sill. Moves between parts run
    // along the very left edge of the picture (x = -6), where the site's crop hides them.
    id: 'window', style: 'room', t: [3.2, 4.5], parts: [
      { d: poly([[440, -40], [440, 125], [-6, 88], [-6, 330], [30, 330], [30, 290], [70, 290], [70, 380], [110, 380], [110, 92], [270, 104], [270, 300], [215, 300], [215, 340], [175, 340], [175, 420], [150, 420], [150, 470], [270, 470], [270, 568], [440, 560], [440, 125], [440, 560], [-6, 588], [-6, 716]]) },
    ] },
  { // left desk, monitor and chair
    id: 'desk', style: 'room', t: [4.5, 5.35], parts: [
      { d: poly([[-6, 716], [470, 702], [175, 708], [175, 690], [82, 690], [82, 536], [290, 532], [290, 690], [300, 702], [420, 664], [405, 805], [150, 835], [300, 862], [300, 942], [215, 1000], [300, 942], [385, 1000]]) },
    ] },
  { // a flight trail: one loop, then up into the centre, where the line becomes the butterfly
    id: 'trail', style: 'room', t: [5.35, 6.0], slowK: 1.2, parts: [
      { d: `M${at(385, 1000)} C${at(600, 1010)} ${at(780, 930)} ${at(740, 820)} C${at(712, 742)} ${at(610, 770)} ${at(650, 840)} C${at(700, 925)} ${at(900, 880)} ${at(1000, 560)}` },
    ] },
  { // the butterfly: slowest stroke, the only colour
    id: 'fly', style: 'fly', t: [6.0, 7.5], slowK: 2.6, parts: [
      { d: FLY, tf: { s: S, x: 1000 - 30 * S - O[0], y: 470 - 22 * S - O[1] } },
    ] },
];
