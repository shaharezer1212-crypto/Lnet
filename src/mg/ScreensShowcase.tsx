import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {SCREENS, SCREENS_BG} from '../clips';
import {StickerBurst} from './StickerBurst';

// Length of this beat (mg-screens seconds * fps). Hard-coded because a
// component inside a Sequence can't read its own length from useVideoConfig.
const FRAMES = 21 * 30;

// SCREENS = [9,8,7,6,5,4,3,2,1] → index map: 0=9, 1=8, 2=7, 3=6, 4=5, 5=4, …
// We show NO side text — just the real system screenshots, BIG, in a browser
// frame. The story builds to the four-values window (screenshot 5 = index 4),
// which is HELD across the whole stretch where the narration says "managers …
// can recognise across four values" and names each one — each value card lights
// up as it's spoken.
const PLAYLIST = [
  {idx: 0, at: 16}, // 9 — KudoZ home feed ("Introducing KudoZ")
  {idx: 3, at: 86}, // 6 — Recognise colleagues panel
  {idx: 4, at: 150}, // 5 — the four-options window (held across the values VO)
  {idx: 5, at: 524}, // 4 — a recognition received
  {idx: 1, at: 588}, // 8 — a recognition story
];

// While the four-options window (idx 4) is on screen, each value card lights up
// in sync with the narration that names it (local frames). `rect` is the card's
// box as a % of the screenshot image; `cur` is the cursor target as a % of the
// full 1920×1080 frame (derived from the browser-frame placement below).
const FOUR_WIN_START = 150;
const FOUR_WIN_END = 524;
const VALUES = [
  // Living ZIM's Core Values — top-left (navy)
  {at: 180, rect: {left: 8.6, top: 24.8, width: 28.3, height: 32.4}, cur: {x: 30.3, y: 43.9}, color: '#284C9B'},
  // Innovation and initiative — bottom-left (purple)
  {at: 265, rect: {left: 8.6, top: 61.1, width: 28.3, height: 31.2}, cur: {x: 30.3, y: 66.6}, color: '#8E54B5'},
  // Special Contribution — bottom-right (green)
  {at: 388, rect: {left: 38.4, top: 61.1, width: 27.2, height: 31.2}, cur: {x: 51.4, y: 66.6}, color: '#74B843'},
  // Collaboration — top-right (orange)
  {at: 462, rect: {left: 38.4, top: 24.8, width: 27.2, height: 32.4}, cur: {x: 51.4, y: 43.9}, color: '#F39A20'},
];

// Browser-frame placement (kept big + lowered, centred so the gold KudoZ medal
// in the lower-right of the background still reads).
const FRAME_LEFT = 270;
const FRAME_TOP = 150;
const FRAME_W = 1380;
const CHROME_H = 42;

export const ScreensShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const frameIn = spring({frame: frame - 8, fps, config: {damping: 15, mass: 0.8}});

  // current screenshot in the playlist (last entry whose `at` has passed)
  let cur = 0;
  for (let k = 0; k < PLAYLIST.length; k++) if (frame >= PLAYLIST[k].at) cur = k;
  const onFour = frame >= FOUR_WIN_START && frame < FOUR_WIN_END;

  // active value card (while the four-options window is held)
  let activeV = -1;
  if (onFour) for (let k = 0; k < VALUES.length; k++) if (frame >= VALUES[k].at) activeV = k;

  // every screenshot change + every value naming is a cursor "click"
  const clickFrames = [...PLAYLIST.map((p) => p.at), ...VALUES.map((v) => v.at)].sort((a, b) => a - b);
  let lastClick = clickFrames[0];
  for (const c of clickFrames) if (frame >= c) lastClick = c;
  const since = frame - lastClick;
  const press = interpolate(since, [0, 4, 12], [1, 0.84, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringD = interpolate(since, [0, 22], [14, 74], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringOp = interpolate(since, [0, 22], [0.42, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // cursor target: over the active value card, else gently over the frame
  const target = activeV >= 0 ? VALUES[activeV].cur : {x: 50, y: 40 + (cur % 2 === 0 ? -3 : 3)};
  // ease the cursor toward its target so it glides between cards
  const glide = interpolate(since, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cx = target.x;
  const cy = target.y;

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: '#0B2C77'}}>
      <Img
        src={SCREENS_BG}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* big, lowered browser frame with the cycling screenshots — no side text */}
      <div
        style={{
          position: 'absolute',
          left: FRAME_LEFT,
          top: FRAME_TOP,
          width: FRAME_W,
          transform: `scale(${interpolate(frameIn, [0, 1], [0.95, 1])})`,
          transformOrigin: 'top center',
          opacity: frameIn,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 50px 120px rgba(0,0,0,0.62)',
          background: '#fff',
        }}
      >
        <div
          style={{
            height: CHROME_H,
            background: '#EAEEF5',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 9,
          }}
        >
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#ff5f57'}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#febc2e'}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#28c840'}} />
          <div
            style={{
              flex: 1,
              height: 26,
              margin: '0 16px',
              borderRadius: 13,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              color: '#8a94a6',
              fontSize: 14,
            }}
          >
            kudoz.zim.com
          </div>
        </div>

        <div style={{position: 'relative', width: '100%', paddingTop: `${(951 / 1908) * 100}%`}}>
          {PLAYLIST.map((p, k) => {
            const op = interpolate(frame, [p.at - 8, p.at + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <Img
                key={k}
                src={SCREENS[p.idx]}
                style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: op}}
              />
            );
          })}

          {/* value-card highlights, drawn over the four-options window */}
          {onFour
            ? VALUES.map((v, i) => {
                const en = spring({frame: frame - v.at, fps, config: {damping: 16, mass: 0.7}});
                const glow = i === activeV ? en : en * 0.18;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${v.rect.left}%`,
                      top: `${v.rect.top}%`,
                      width: `${v.rect.width}%`,
                      height: `${v.rect.height}%`,
                      borderRadius: 14,
                      border: `4px solid ${v.color}`,
                      boxShadow: `0 0 ${30 * glow}px ${v.color}, inset 0 0 ${20 * glow}px ${v.color}55`,
                      opacity: glow,
                      transform: `scale(${interpolate(i === activeV ? en : 1, [0, 1], [1.04, 1])})`,
                    }}
                  />
                );
              })
            : null}
        </div>
      </div>

      {/* click ripple + cursor */}
      <div
        style={{
          position: 'absolute',
          left: `${cx}%`,
          top: `${cy}%`,
          width: ringD,
          height: ringD,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.85)',
          transform: 'translate(-50%,-50%)',
          opacity: ringOp * glide,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${cx}%`,
          top: `${cy}%`,
          transform: `translate(-8%,-6%) scale(${press})`,
          opacity: 0.9,
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24">
          <path d="M5 3l14 7-6 1.5L11 18 5 3z" fill="#fff" stroke="#0B1B3A" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>

      <StickerBurst frames={FRAMES} startAt={24} count={4} size={200} />
    </AbsoluteFill>
  );
};
