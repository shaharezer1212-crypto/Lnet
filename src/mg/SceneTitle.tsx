import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';

// An animated on-screen title in the brand font (Magistral): the words rise in
// with a staggered spring, a gold accent bar wipes underneath, it holds, then
// lifts away before the scene ends. Sits in the lower third so it never covers
// faces. `frames` is the length of the host scene (for the exit timing).
export const SceneTitle: React.FC<{text: string; frames: number; startAt?: number}> = ({
  text,
  frames,
  startAt = 8,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');

  const outStart = frames - 20;
  const out = interpolate(frame, [outStart, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupY = interpolate(out, [0, 1], [0, -26]);
  const groupFade = 1 - out;

  // gold accent bar wipes in under the words, then out with the group
  const barIn = spring({frame: frame - startAt - 6, fps, config: {damping: 18, mass: 0.9}});
  const barW = barIn * 360 * (1 - out);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 130,
        pointerEvents: 'none',
      }}
    >
      <div style={{transform: `translateY(${groupY}px)`, opacity: groupFade, textAlign: 'center'}}>
        <div style={{display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap'}}>
          {words.map((w, i) => {
            const enter = spring({
              frame: frame - startAt - i * 5,
              fps,
              config: {damping: 13, mass: 0.7},
            });
            const y = interpolate(enter, [0, 1], [40, 0]);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${y}px)`,
                  opacity: enter,
                  fontSize: 62,
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '0 6px 28px rgba(0,0,0,0.55)',
                  letterSpacing: 0.5,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            height: 6,
            width: barW,
            background: COLORS.yellow,
            borderRadius: 6,
            margin: '18px auto 0',
            boxShadow: `0 0 18px ${COLORS.yellow}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
