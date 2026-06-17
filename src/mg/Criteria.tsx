import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';

// Official ZIM recognition criteria — exact labels, colours and icons.
const CARDS = [
  {title: 'Living ZIM’s Core Values', color: '#243A77', icon: '⭐'},
  {title: 'Collaboration', color: '#F39A20', icon: '🤝'},
  {title: 'Innovation and initiative', color: '#8E44AD', icon: '🧠'},
  {title: 'Special Contribution', color: '#74B843', icon: '🎯'},
];

const WHITE_ICON: React.CSSProperties = {
  // turn any emoji into a clean white silhouette to match the brand icons
  filter: 'brightness(0) invert(1)',
  fontSize: 64,
  lineHeight: 1,
};

const Card: React.FC<{index: number; title: string; color: string; icon: string}> = ({
  index,
  title,
  color,
  icon,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 18 - index * 12, fps, config: {damping: 14, mass: 0.7}});
  const y = interpolate(enter, [0, 1], [70, 0]);

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 22px 55px rgba(6,36,90,0.18)',
        transform: `translateY(${y}px)`,
        opacity: enter,
        height: 300,
      }}
    >
      {/* coloured header with a convex bottom curve */}
      <svg
        width="100%"
        height="62%"
        viewBox="0 0 100 62"
        preserveAspectRatio="none"
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <path d="M0,0 H100 V40 Q50,68 0,40 Z" fill={color} />
      </svg>

      {/* icon badge straddling the header / white boundary */}
      <div
        style={{
          position: 'absolute',
          top: '34%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 124,
          height: 124,
          borderRadius: '50%',
          background: color,
          border: '6px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={WHITE_ICON}>{icon}</span>
      </div>

      {/* title */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 800,
          color: '#243A77',
          padding: '0 16px',
        }}
      >
        {title}
      </div>
    </div>
  );
};

// The four reward criteria, in the official ZIM card design, with playful
// KudoZ mascots floating around them.
export const Criteria: React.FC = () => {
  const frame = useCurrentFrame();
  const titleFade = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${COLORS.zimBlue} 0%, ${COLORS.zimBlueDeep} 62%, #03132E 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '70px 110px',
      }}
    >
      <div
        style={{
          opacity: titleFade,
          fontSize: 48,
          fontWeight: 900,
          color: '#fff',
          marginBottom: 34,
        }}
      >
        Recognize across <span style={{color: COLORS.yellow}}>four</span> values
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 30,
          width: '100%',
          maxWidth: 1180,
        }}
      >
        {CARDS.map((c, i) => (
          <Card key={c.title} index={i} {...c} />
        ))}
      </div>

      <StickerBurst frames={300} startAt={20} />
    </AbsoluteFill>
  );
};
