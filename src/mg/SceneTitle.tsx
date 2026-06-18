import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';

// A large animated on-screen title in the brand font (Magistral). The words
// rise in gradually with a soft staggered spring, hold in the lower third, then
// lift away before the scene ends. No underline bar — just clean, bold type.
// `frames` is the length of the host scene (for the exit timing).
export const SceneTitle: React.FC<{
  text: string;
  frames: number;
  startAt?: number;
  position?: 'bottom' | 'left';
}> = ({text, frames, startAt = 8, position = 'bottom'}) => {
  const left = position === 'left';
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');

  const outStart = frames - 22;
  const out = interpolate(frame, [outStart, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupY = interpolate(out, [0, 1], [0, -30]);
  const groupFade = 1 - out;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: left ? 'flex-start' : 'center',
        justifyContent: left ? 'center' : 'flex-end',
        paddingBottom: left ? 0 : 120,
        paddingLeft: left ? 110 : 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translateY(${groupY}px)`,
          opacity: groupFade,
          textAlign: left ? 'left' : 'center',
          display: 'flex',
          flexDirection: left ? 'column' : 'row',
          gap: left ? 6 : 24,
          alignItems: left ? 'flex-start' : 'center',
          justifyContent: left ? 'center' : 'center',
          flexWrap: 'wrap',
          padding: left ? 0 : '0 80px',
          maxWidth: left ? '46%' : undefined,
        }}
      >
        {words.map((w, i) => {
          // gentle, gradual rise — each word a touch after the last
          const enter = spring({
            frame: frame - startAt - i * 6,
            fps,
            config: {damping: 16, mass: 0.9},
          });
          const y = interpolate(enter, [0, 1], [70, 0]);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                opacity: enter,
                fontSize: 92,
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 8px 34px rgba(0,0,0,0.6)',
                letterSpacing: 0.5,
                lineHeight: 1.05,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
