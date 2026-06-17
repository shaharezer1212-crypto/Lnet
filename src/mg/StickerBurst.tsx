import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Img} from 'remotion';
import {STICKERS} from '../clips';

type Spot = {x: number; y: number};

// Resting spots, all hugging the edges/corners of the frame — a sticker never
// travels toward the centre where the logo / cards live.
const EDGE_SPOTS: Spot[] = [
  {x: 12, y: 24},
  {x: 88, y: 22},
  {x: 91, y: 72},
  {x: 10, y: 76},
  {x: 50, y: 12},
  {x: 91, y: 46},
  {x: 50, y: 90},
  {x: 9, y: 50},
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

        const enter = spring({frame: local, fps, config: {damping: 16, mass: 0.8}});
        const fadeIn = interpolate(local, [0, 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(local, [life - 16, life], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);

        const t = local / fps;
        // arrive "from a distance": small + softly out of focus, then resolves
        const scaleIn = interpolate(enter, [0, 1], [0.7, 1]);
        const blurIn = interpolate(local, [0, 12], [7, 0], {extrapolateRight: 'clamp'});
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
              transform: `translate(-50%,-50%) translateY(${bob}px) scale(${scaleIn * breathe}) rotate(${sway}deg)`,
              opacity,
              filter: `blur(${blurIn}px)`,
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
