import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';

type Mascot = {
  emoji: string;
  label: string;
  bg: string;
  // position in %
  x: number;
  y: number;
  size: number;
  phase: number;
};

// The KudoZ mascot family (placeholder chips until the real PNGs are provided).
const MASCOTS: Mascot[] = [
  {emoji: '👍', label: 'Nice', bg: COLORS.yellow, x: 8, y: 22, size: 1, phase: 0},
  {emoji: '⭐', label: 'Drop', bg: COLORS.purple, x: 84, y: 16, size: 1.1, phase: 1.1},
  {emoji: '👟', label: 'On Fire', bg: COLORS.sky, x: 14, y: 70, size: 0.95, phase: 2.2},
  {emoji: '🙌', label: 'Awesome', bg: COLORS.pink, x: 86, y: 66, size: 1.05, phase: 3.3},
  {emoji: '🎯', label: 'KudoZ', bg: COLORS.green, x: 50, y: 84, size: 0.9, phase: 4.4},
];

const Chip: React.FC<{m: Mascot}> = ({m}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 6 - m.phase * 4, fps, config: {damping: 12, mass: 0.6}});
  // gentle floating bob + sway
  const t = frame / fps + m.phase;
  const bob = Math.sin(t * 1.6) * 14;
  const sway = Math.cos(t * 1.1) * 8;
  const rot = Math.sin(t * 1.3) * 5;
  const scale = interpolate(enter, [0, 1], [0.4, m.size]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${m.x}%`,
        top: `${m.y}%`,
        transform: `translate(-50%,-50%) translate(${sway}px, ${bob}px) scale(${scale}) rotate(${rot}deg)`,
        opacity: enter,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px 12px 14px',
        borderRadius: 999,
        background: '#fff',
        boxShadow: `0 14px 34px rgba(6,36,90,0.22)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: m.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
        }}
      >
        {m.emoji}
      </div>
      <div style={{fontSize: 26, fontWeight: 800, color: COLORS.ink, paddingRight: 6}}>{m.label}</div>
    </div>
  );
};

// Playful KudoZ mascots drifting around the frame.
export const FloatingMascots: React.FC = () => {
  return (
    <>
      {MASCOTS.map((m) => (
        <Chip key={m.label} m={m} />
      ))}
    </>
  );
};
