import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';

const ITEMS = [
  {icon: '🧭', title: 'Core Values', tint: COLORS.sky},
  {icon: '💡', title: 'Initiative & Innovation', tint: COLORS.yellow},
  {icon: '⭐', title: 'Special Contribution', tint: COLORS.pink},
  {icon: '🤝', title: 'Collaboration', tint: COLORS.green},
];

const Card: React.FC<{index: number; icon: string; title: string; tint: string}> = ({
  index,
  icon,
  title,
  tint,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delay = 24 + index * 18;
  const enter = spring({frame: frame - delay, fps, config: {damping: 13, mass: 0.7}});
  const y = interpolate(enter, [0, 1], [60, 0]);

  return (
    <div
      style={{
        flex: 1,
        background: '#fff',
        borderRadius: 28,
        padding: '40px 28px',
        textAlign: 'center',
        boxShadow: '0 24px 60px rgba(6,36,90,0.25)',
        transform: `translateY(${y}px)`,
        opacity: enter,
        borderTop: `10px solid ${tint}`,
      }}
    >
      <div style={{fontSize: 96, lineHeight: 1}}>{icon}</div>
      <div style={{fontSize: 34, fontWeight: 800, color: COLORS.ink, marginTop: 18}}>{title}</div>
    </div>
  );
};

// The four reward criteria animating in one-by-one, synced to the narration.
export const Criteria: React.FC = () => {
  const frame = useCurrentFrame();
  const titleFade = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.paper} 0%, #DCEBFF 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 90,
      }}
    >
      <div style={{opacity: titleFade, fontSize: 56, fontWeight: 900, color: COLORS.zimBlue, marginBottom: 56}}>
        Reward across <span style={{color: COLORS.pink}}>four</span> values
      </div>
      <div style={{display: 'flex', gap: 28, width: '100%', alignItems: 'stretch'}}>
        {ITEMS.map((it, i) => (
          <Card key={it.title} index={i} {...it} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
