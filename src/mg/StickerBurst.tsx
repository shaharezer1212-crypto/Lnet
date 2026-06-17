import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Img} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number; size: number; drift?: number};

// 8 positions ringing the frame — every sticker gets used, big, and they
// stay clear of the centered logo / criteria cards.
const DEFAULT_SPOTS: Spot[] = [
  {x: 13, y: 22, size: 440, drift: 8},
  {x: 50, y: 14, size: 430, drift: -6},
  {x: 87, y: 22, size: 450, drift: -9},
  {x: 92, y: 52, size: 420, drift: 7},
  {x: 86, y: 82, size: 450, drift: -8},
  {x: 50, y: 90, size: 430, drift: 6},
  {x: 14, y: 82, size: 440, drift: 9},
  {x: 8, y: 52, size: 420, drift: 10},
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
  const life = step * 1.6;

  return (
    <>
      {spots.map((s, i) => {
        const local = frame - (startAt + i * step);
        if (local < 0 || local > life) return null;
        const lt = local / fps;
        const ph = i * 1.7;

        const inAmt = spring({frame: local, fps, config: {damping: 8, mass: 0.5}});
        const out = interpolate(local, [life - 12, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const base = interpolate(inAmt, [0, 1], [0.05, 1]) * interpolate(out, [0, 1], [0.5, 1]);
        const opacity = Math.min(interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}), out);

        // alive: squash/stretch + wiggle + bob
        const breathe = Math.sin(lt * 6 + ph);
        const sx = base * (1 + breathe * 0.07);
        const sy = base * (1 - breathe * 0.07);
        const wiggle = Math.sin(lt * 5 + ph) * 7 + Math.sin(lt * 2.3 + ph) * 4;
        const bob = Math.sin(lt * 3.1 + ph) * 22;
        const driftX = (s.drift ?? 8) * lt * 5;
        const exitFly = interpolate(out, [0, 1], [-70, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              transform: `translate(-50%,-50%) translate(${driftX}px, ${bob + exitFly}px) rotate(${wiggle}deg) scale(${sx}, ${sy})`,
              opacity,
            }}
          >
            {/* soft halo so a sticker (e.g. the blue sneaker) stays visible on a blue stage */}
            <div
              style={{
                position: 'absolute',
                inset: '-8%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 38%, rgba(255,255,255,0) 66%)',
                filter: 'blur(8px)',
              }}
            />
            <Img
              src={STICKERS[i % STICKERS.length]}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.4))',
              }}
            />
          </div>
        );
      })}
    </>
  );
};
