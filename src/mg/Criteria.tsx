import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';
import {ShineText, Stage} from './fx';

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
  const enter = spring({frame: frame - 20 - index * 11, fps, config: {damping: 13, mass: 0.7}});
  // cards flip up into place with a little 3D tilt, then breathe
  const rotX = interpolate(enter, [0, 1], [55, 0]);
  const y = interpolate(enter, [0, 1], [80, 0]);
  const t = frame / fps;
  const bob = Math.sin(t * 1.6 + index) * 5 * enter;
  const badgePop = spring({frame: frame - 30 - index * 11, fps, config: {damping: 9, mass: 0.5}});

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: `0 26px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)`,
        transform: `perspective(900px) rotateX(${rotX}deg) translateY(${y + bob}px)`,
        transformOrigin: 'bottom center',
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

      {/* moving sheen across the coloured header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '62%',
          background: `linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 60%)`,
          backgroundSize: '240% 100%',
          backgroundPositionX: `${130 - (((frame + index * 18) % 110) / 110) * 260}%`,
          mixBlendMode: 'screen',
        }}
      />

      {/* icon badge straddling the header / white boundary */}
      <div
        style={{
          position: 'absolute',
          top: '34%',
          left: '50%',
          transform: `translate(-50%,-50%) scale(${interpolate(badgePop, [0, 1], [0.3, 1])})`,
          width: 124,
          height: 124,
          borderRadius: '50%',
          background: color,
          border: '6px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 26px ${color}`,
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

// The four reward criteria, in the official ZIM card design, flipping in over
// the brand stage with playful KudoZ mascots floating around them.
export const Criteria: React.FC = () => {
  const frame = useCurrentFrame();
  const titleFade = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [0, 16], [-26, 0], {extrapolateRight: 'clamp'});

  return (
    <Stage bokehSeed="criteria">
      <AbsoluteFill
        style={{
          fontFamily: FONT,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '70px 110px',
        }}
      >
        <div
          style={{
            opacity: titleFade,
            transform: `translateY(${titleY}px)`,
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 34,
            textShadow: '0 4px 22px rgba(0,0,0,0.4)',
          }}
        >
          <ShineText base="#fff" highlight="rgba(255,196,46,0.9)" period={120}>
            Recognize across{' '}
          </ShineText>
          <ShineText base={COLORS.yellow} highlight="#fff" period={80} style={{fontWeight: 900}}>
            four
          </ShineText>
          <ShineText base="#fff" highlight="rgba(255,196,46,0.9)" period={120}>
            {' '}
            values
          </ShineText>
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
    </Stage>
  );
};
