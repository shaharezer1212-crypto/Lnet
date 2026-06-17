import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number; size: number; drift?: number};

// Big, lively stickers that pop on, drift/spin/bounce, and fly off in turn.
const DEFAULT_SPOTS: Spot[] = [
  {x: 50, y: 48, size: 560, drift: -8},
  {x: 28, y: 42, size: 460, drift: 10},
  {x: 72, y: 44, size: 480, drift: -10},
  {x: 40, y: 60, size: 460, drift: 8},
  {x: 62, y: 58, size: 500, drift: -9},
  {x: 50, y: 46, size: 540, drift: 7},
];

export const StickerBurst: React.FC<{frames: number; spots?: Spot[]; startAt?: number}> = ({
  frames,
  spots = DEFAULT_SPOTS,
  startAt = 4,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = spots.length;
  const span = Math.max(1, frames - startAt);
  const step = span / n;
  const life = step * 1.55;

  return (
    <>
      {spots.map((s, i) => {
        const local = frame - (startAt + i * step);
        if (local < 0 || local > life) return null;
        const lt = local / fps;

        // pop in (overshoot), hold, fly out
        const inAmt = spring({frame: local, fps, config: {damping: 8, mass: 0.5}});
        const out = interpolate(local, [life - 11, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(inAmt, [0, 1], [0.05, 1]) * interpolate(out, [0, 1], [0.55, 1]);
        const opacity = Math.min(interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}), out);

        // lively motion: continuous spin, bounce, sideways drift
        const spin = (s.drift ?? 8) * 1.4 * lt + Math.sin(lt * 3) * 7;
        const bounce = Math.sin(lt * 4.2) * 26;
        const driftX = (s.drift ?? 8) * lt * 6;
        const exitFly = interpolate(out, [0, 1], [-70, 0]); // slight upward fly on exit

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
              transform: `translate(-50%,-50%) translate(${driftX}px, ${bounce + exitFly}px) scale(${scale}) rotate(${spin}deg)`,
              opacity,
              filter: 'drop-shadow(0 22px 48px rgba(0,0,0,0.35))',
            }}
          />
        );
      })}
    </>
  );
};
