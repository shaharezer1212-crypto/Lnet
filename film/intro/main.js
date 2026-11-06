import { buildPath, headAt, posAt } from './geom.js';
import { SEGS } from './room.js';
import { prepare, drawLine } from './ink.js';
import { makePaper, drawPaper, makeTooth, drawTooth } from './paper.js';
import { camAt, worldToScreen } from './cam.js';
import { CAM } from './shots.js';
import { penShadow } from './hands.js';
import { clamp, ss } from '/core/lib.js';

const q = new URLSearchParams(location.search);
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
const DUR = 9.4;
const P = prepare(buildPath(SEGS));
const paper = makePaper(), tooth = makeTooth();
const END = P.T[P.N - 1];

function render(t) {
  let cam = camAt(P, CAM, t, W, H);
  if (q.has('all')) cam = { cx: 0, cy: 0, k: 0.96, r: 0, z: 1 };
  const M = worldToScreen(cam, W, H);
  drawPaper(ctx, paper, cam, W, H);
  const head = q.has('all') ? P.N - 1 : headAt(P, t);
  if (t >= P.T[0] || q.has('all')) drawLine(ctx, P, head, M, cam.k);
  drawTooth(ctx, tooth, cam, W, H);
  if (!q.has('all')) {
    const tip = M(...posAt(P, head));
    // the pen comes in from the lower right, like a right hand, and lifts away at the end
    const lift = clamp((t - END) / 0.7);
    const alpha = clamp((t - 0.05) / 0.3) * (1 - ss(clamp((t - END - 0.2) / 0.6)));
    if (alpha > 0) penShadow(ctx, tip, [0.56, 0.83], cam.k, { lift, alpha });
  }
}

window.DUR = DUR;
window.EV = [{ t: P.T[0], type: 'tap' }];
window.render = render;
window.READY = true;
