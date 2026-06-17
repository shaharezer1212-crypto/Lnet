import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number; size: number; drift?: number};

// Big, lively stickers that pop on, stay ALIVE (squash/stretch + wiggle +
// bob), and fly off in turn.
const DEFAULT_SPOTS: Spot[] = [
  {x: 50, y: 48, size: 560, drift: -8},
  {x: 28, y: 42, size: 470, drift: 10},
  {x: 72, y: 44, size: 490, drift: -10},
  {x: 40, y: 60, size: 470, drift: 8},
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
        const ph = i * 1.7; // per-sticker phase so they don't move in lockstep

        // pop in (overshoot) → hold → fly out
        const inAmt = spring({frame: local, fps, config: {damping: 8, mass: 0.5}});
        const out = interpolate(local, [life - 11, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const base = interpolate(inAmt, [0, 1], [0.05, 1]) * interpolate(out, [0, 1], [0.55, 1]);
        const opacity = Math.min(interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}), out);

        // ALIVE: volume-preserving squash & stretch + a happy wiggle + bob
        const breathe = Math.sin(lt * 6 + ph); // fast jiggle
        const sx = base * (1 + breathe * 0.07);
        const sy = base * (1 - breathe * 0.07);
        const wiggle = Math.sin(lt * 5 + ph) * 7 + Math.sin(lt * 2.3 + ph) * 4;
        const bob = Math.sin(lt * 3.1 + ph) * 22;
        const driftX = (s.drift ?? 8) * lt * 5;
        const exitFly = interpolate(out, [0, 1], [-70, 0]);

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
              transform: `translate(-50%,-50%) translate(${driftX}px, ${bob + exitFly}px) rotate(${wiggle}deg) scale(${sx}, ${sy})`,
              opacity,
              filter: 'drop-shadow(0 22px 48px rgba(0,0,0,0.35))',
            }}
          />
        );
      })}
    </>
  );
};
