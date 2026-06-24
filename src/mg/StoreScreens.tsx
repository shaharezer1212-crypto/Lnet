import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {SCREENS, SCREENS_BG} from '../clips';
import {StickerBurst} from './StickerBurst';

// A short "breath" on the blue brand screen: the KudoZ online store (the
// virtual mall) shown big in the browser frame, music only, no narration —
// a beat to take in the shop before the gifts scene. SCREENS indices:
// 8 = store home / categories, 7 = sale products, 6 = points dashboard.
const FRAMES = Math.round(4.5 * 30);

const SHOTS = [
  {idx: 6, at: 8}, // "explore, shop, redeem" points dashboard
  {idx: 8, at: 56}, // trending store categories
  {idx: 7, at: 100}, // sale products
];

const FRAME_LEFT = 270;
const FRAME_TOP = 150;
const FRAME_W = 1380;
const CHROME_H = 42;

export const StoreScreens: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const frameIn = spring({frame: frame - 6, fps, config: {damping: 15, mass: 0.8}});

  let cur = 0;
  for (let k = 0; k < SHOTS.length; k++) if (frame >= SHOTS[k].at) cur = k;

  const lastAt = SHOTS[cur].at;
  const since = frame - lastAt;
  const press = interpolate(since, [0, 4, 12], [1, 0.86, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringD = interpolate(since, [0, 22], [14, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringOp = interpolate(since, [0, 22], [0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // cursor drifts gently over the storefront and clicks on each change
  const cx = 50 + Math.sin((frame / fps) * 0.8) * 8;
  const cy = 42 + (cur % 2 === 0 ? -4 : 6);

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: '#0B2C77'}}>
      <Img src={SCREENS_BG} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />

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
          style={{height: CHROME_H, background: '#EAEEF5', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 9}}
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
            kudoz.zim.com/store
          </div>
        </div>

        <div style={{position: 'relative', width: '100%', paddingTop: `${(951 / 1908) * 100}%`}}>
          {SHOTS.map((s, k) => {
            const op = interpolate(frame, [s.at - 8, s.at + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <Img
                key={k}
                src={SCREENS[s.idx]}
                style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: op}}
              />
            );
          })}
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
          opacity: ringOp,
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

      <StickerBurst frames={FRAMES} startAt={14} count={3} size={190} />
    </AbsoluteFill>
  );
};
