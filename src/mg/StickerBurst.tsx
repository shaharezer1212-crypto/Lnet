import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number; size: number};

// Big stickers that pop onto the screen one at a time and vanish in turn.
const DEFAULT_SPOTS: Spot[] = [
  {x: 50, y: 46, size: 480},
  {x: 27, y: 40, size: 380},
  {x: 73, y: 42, size: 400},
  {x: 38, y: 62, size: 380},
  {x: 64, y: 60, size: 400},
  {x: 50, y: 45, size: 460},
];

export const StickerBurst: React.FC<{frames: number; spots?: Spot[]; startAt?: number}> = ({
  frames,
  spots = DEFAULT_SPOTS,
  startAt = 6,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = spots.length;
  const span = Math.max(1, frames - startAt);
  const step = span / n; // each sticker's slot
  const life = step * 1.5; // on-screen time (slight overlap)

  return (
    <>
      {spots.map((s, i) => {
        const local = frame - (startAt + i * step);
        if (local < 0 || local > life) return null;
        const inAmt = spring({frame: local, fps, config: {damping: 9, mass: 0.5}}); // overshoot
        const out = interpolate(local, [life - 9, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(inAmt, [0, 1], [0.1, 1]) * interpolate(out, [0, 1], [0.7, 1]);
        const opacity = Math.min(
          interpolate(local, [0, 6], [0, 1], {extrapolateRight: 'clamp'}),
          out,
        );
        const wob = Math.sin((local / fps) * 5) * 5;
        return (
          <Img
            key={i}
            src={STICKERS[i % STICKERS.length]}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              objectFit: 'contain',
              transform: `translate(-50%,-50%) scale(${scale}) rotate(${wob}deg)`,
              opacity,
              filter: 'drop-shadow(0 18px 40px rgba(6,36,90,0.32))',
            }}
          />
        );
      })}
    </>
  );
};
