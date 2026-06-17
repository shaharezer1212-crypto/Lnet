import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STICKERS} from '../clips';

// Layout positions around the frame edges (so the center content stays clear).
const SPOTS = [
  {x: 9, y: 20, size: 150, phase: 0.0},
  {x: 91, y: 15, size: 135, phase: 1.1},
  {x: 15, y: 76, size: 140, phase: 2.0},
  {x: 87, y: 72, size: 150, phase: 3.1},
  {x: 6, y: 49, size: 120, phase: 4.0},
  {x: 94, y: 47, size: 120, phase: 0.7},
  {x: 36, y: 90, size: 120, phase: 2.6},
  {x: 66, y: 91, size: 130, phase: 3.7},
];

const Sticker: React.FC<{url: string; x: number; y: number; size: number; phase: number}> = ({
  url,
  x,
  y,
  size,
  phase,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4 - phase * 4, fps, config: {damping: 12, mass: 0.6}});
  const t = frame / fps + phase;
  const bob = Math.sin(t * 1.7) * 16;
  const sway = Math.cos(t * 1.15) * 10;
  const rot = Math.sin(t * 1.4) * 6;
  const pulse = 1 + Math.sin(t * 2.2) * 0.04;
  const appear = interpolate(enter, [0, 1], [0.3, 1]);

  return (
    <Img
      src={url}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        objectFit: 'contain',
        transform: `translate(-50%,-50%) translate(${sway}px, ${bob}px) scale(${appear * pulse}) rotate(${rot}deg)`,
        opacity: enter,
        filter: 'drop-shadow(0 12px 24px rgba(6,36,90,0.28))',
      }}
    />
  );
};

// The real KudoZ stickers drifting playfully around the frame.
export const FloatingMascots: React.FC = () => {
  return (
    <>
      {SPOTS.map((s, i) => (
        <Sticker key={i} url={STICKERS[i % STICKERS.length]} {...s} />
      ))}
    </>
  );
};
