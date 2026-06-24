import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {SCREENS, SCREENS_BG} from '../clips';
import {StickerBurst} from './StickerBurst';

// Length of this beat (mg-screens seconds * fps). Hard-coded because a
// component inside a Sequence can't read its own length from useVideoConfig.
const FRAMES = 21 * 30;

// The four reward values, kept as an elegant title beside the screens.
const VALUES = [
  {label: 'Living ZIM’s Core Values', color: '#3E6BD6'},
  {label: 'Innovation and initiative', color: '#A56BE0'},
  {label: 'Special Contribution', color: '#74B843'},
  {label: 'Collaboration', color: '#F39A20'},
];

// On the VB-BG-1 brand background: the real KudoZ system screenshots play in a
// browser frame with a clicking cursor (shown 9 → 1), the four values kept as a
// title on the left, KudoZ stickers popping at the edges.
export const ScreensShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = SCREENS.length;

  const startAt = 16;
  const tail = 8;
  const span = Math.max(1, FRAMES - startAt - tail);
  const step = span / n;
  const idx = Math.max(0, Math.min(n - 1, Math.floor((frame - startAt) / step)));

  // a click fires every time the screenshot changes
  const boundary = startAt + idx * step;
  const since = frame - boundary;
  const press = interpolate(since, [0, 4, 12], [1, 0.84, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringD = interpolate(since, [0, 18], [14, 104], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringOp = interpolate(since, [0, 18], [0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cx = 64 + ((idx % 3) - 1) * 7; // %
  const cy = 50 + (idx % 2 === 0 ? -7 : 7);

  const titleIn = spring({frame: frame - 6, fps, config: {damping: 16, mass: 0.9}});
  const frameIn = spring({frame: frame - 10, fps, config: {damping: 15, mass: 0.8}});

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: '#0B2C77'}}>
      <Img
        src={SCREENS_BG}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* title + the four values, on the open left side of the background */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 150,
          width: 560,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [26, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.08,
            textShadow: '0 6px 26px rgba(0,0,0,0.45)',
          }}
        >
          Recognize across <span style={{color: COLORS.yellow}}>four</span> values
        </div>
        <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18}}>
          {VALUES.map((v, i) => {
            const en = spring({frame: frame - 20 - i * 7, fps, config: {damping: 16, mass: 0.8}});
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: en,
                  transform: `translateX(${interpolate(en, [0, 1], [-22, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: v.color,
                    boxShadow: `0 0 14px ${v.color}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{fontSize: 30, fontWeight: 700, color: '#fff'}}>{v.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* browser frame with the cycling screenshots */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: '50%',
          width: 1060,
          transform: `translateY(-50%) scale(${interpolate(frameIn, [0, 1], [0.92, 1])})`,
          opacity: frameIn,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 44px 100px rgba(0,0,0,0.6)',
          background: '#fff',
        }}
      >
        <div
          style={{
            height: 42,
            background: '#EAEEF5',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 8,
          }}
        >
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ff5f57'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#febc2e'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#28c840'}} />
          <div
            style={{
              flex: 1,
              height: 24,
              margin: '0 14px',
              borderRadius: 12,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 14,
              color: '#8a94a6',
              fontSize: 13,
            }}
          >
            kudoz.zim.com
          </div>
        </div>
        <div style={{position: 'relative', width: '100%', paddingTop: `${(951 / 1908) * 100}%`}}>
          {SCREENS.map((src, j) => {
            const wStart = startAt + j * step;
            const op =
              j === 0
                ? 1
                : interpolate(frame, [wStart - 6, wStart + 6], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
            return (
              <Img
                key={j}
                src={src}
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
          border: '4px solid rgba(255,196,46,0.95)',
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
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24">
          <path d="M5 3l14 7-6 1.5L11 18 5 3z" fill="#fff" stroke="#0B1B3A" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>

      <StickerBurst frames={FRAMES} startAt={20} count={5} size={210} />
    </AbsoluteFill>
  );
};
