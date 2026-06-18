import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Img} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number};

// Resting spots, all hugging the corners / side margins of the frame — never
// the horizontal centre (where titles, subtitles and cards live) and never
// drifting toward the middle.
const EDGE_SPOTS: Spot[] = [
  {x: 11, y: 24},
  {x: 89, y: 22},
  {x: 90, y: 74},
  {x: 10, y: 76},
  {x: 7, y: 50},
  {x: 93, y: 50},
];

// Gentle, natural mascots: they ease in "from a distance" (small + soft focus),
// hold near an edge with a tiny breathing bob, then fade away — one at a time,
// with clear gaps between them. Calm, premium, never busy.
export const StickerBurst: React.FC<{
  frames: number;
  startAt?: number;
  count?: number;
  size?: number;
  spots?: Spot[];
}> = ({frames, startAt = 8, count, size = 300, spots = EDGE_SPOTS}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const n = Math.min(count ?? spots.length, spots.length);
  const tail = 8;
  const span = Math.max(1, frames - startAt - tail);
  const step = span / n; // even cadence
  const life = step; // each lives one slot → roughly one on screen at a time

  return (
    <>
      {spots.slice(0, n).map((s, i) => {
        const local = frame - (startAt + i * step);
        if (local < 0 || local > life) return null;

        // POP-UP entrance: a bouncy spring scale (with a little overshoot)
        // instead of a soft fade — reads like a sticker popping onto screen.
        const pop = spring({frame: local, fps, config: {damping: 9, mass: 0.6}});
        const fadeIn = interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(local, [life - 12, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);
        // quick pop-down on the way out
        const exitScale = interpolate(local, [life - 12, life], [1, 0.7], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const t = local / fps;
        // tiny in-place life — no travel, no drift to centre
        const bob = Math.sin(t * 1.5 + i) * 5;
        const sway = Math.sin(t * 1.0 + i) * 3;
        const breathe = 1 + Math.sin(t * 2 + i) * 0.02;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: size,
              height: size,
              transform: `translate(-50%,-50%) translateY(${bob}px) scale(${pop * exitScale * breathe}) rotate(${sway}deg)`,
              opacity,
            }}
          >
            {/* subtle soft glow so a sticker stays readable on the navy stage */}
            <div
              style={{
                position: 'absolute',
                inset: '4%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 42%, rgba(255,255,255,0) 64%)',
                filter: 'blur(6px)',
              }}
            />
            <Img
              src={STICKERS[i % STICKERS.length]}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.38))',
              }}
            />
          </div>
        );
      })}
    </>
  );
};
