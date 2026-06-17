import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';
import {LOGO_URL} from '../clips';

const CORNER_SPOTS = [
  {x: 13, y: 24, size: 240},
  {x: 87, y: 22, size: 240},
  {x: 15, y: 80, size: 230},
  {x: 85, y: 80, size: 240},
];

// Cinematic close-up reveal of the gold KudoZ medal on a deep brand stage:
// it pushes in from an oversized close-up, settles with a gentle swing and a
// golden glow, while stickers pop in the corners.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 14, mass: 0.9}});
  const scale = interpolate(pop, [0, 1], [1.7, 1]); // close-up → settle
  const swing = Math.sin((frame / fps) * 1.5) * 2;
  const glow = 0.5 + Math.sin((frame / fps) * 2) * 0.18;
  const kicker = interpolate(frame, [10, 26], [0, 1], {extrapolateRight: 'clamp'});
  const sub = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${COLORS.zimBlue} 0%, ${COLORS.zimBlueDeep} 60%, #03132E 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 120,
          color: COLORS.yellow,
          fontSize: 30,
          letterSpacing: 12,
          textTransform: 'uppercase',
          fontWeight: 800,
          opacity: kicker,
        }}
      >
        Introducing
      </div>

      {/* golden glow behind the medal */}
      <div
        style={{
          position: 'absolute',
          width: 720,
          height: 720,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,196,46,${glow}) 0%, rgba(255,196,46,0) 60%)`,
          filter: 'blur(20px)',
        }}
      />

      <Img
        src={LOGO_URL}
        style={{
          height: 620,
          objectFit: 'contain',
          transform: `scale(${scale}) rotate(${swing}deg)`,
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))',
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 120,
          color: '#fff',
          fontSize: 36,
          fontWeight: 600,
          opacity: sub,
          letterSpacing: 1,
        }}
      >
        ZIM’s new employee recognition system
      </div>

      <StickerBurst frames={120} spots={CORNER_SPOTS} startAt={14} />
    </AbsoluteFill>
  );
};
