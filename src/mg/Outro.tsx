import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';
import {LOGO_URL} from '../clips';

// Closing logo + tagline on a deep brand stage, stickers popping in the corners.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12, mass: 0.7}});
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const swing = Math.sin((frame / fps) * 1.4) * 2;
  const glow = 0.5 + Math.sin((frame / fps) * 2) * 0.18;
  const lineFade = interpolate(frame, [24, 40], [0, 1], {extrapolateRight: 'clamp'});
  const lineWidth = interpolate(frame, [24, 46], [0, 560], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 44%, ${COLORS.zimBlue} 0%, ${COLORS.zimBlueDeep} 60%, #03132E 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,196,46,${glow}) 0%, rgba(255,196,46,0) 60%)`,
          filter: 'blur(18px)',
        }}
      />

      <div style={{textAlign: 'center', zIndex: 2}}>
        <Img
          src={LOGO_URL}
          style={{
            height: 420,
            objectFit: 'contain',
            transform: `scale(${scale}) rotate(${swing}deg)`,
            filter: 'drop-shadow(0 26px 54px rgba(0,0,0,0.45))',
          }}
        />
        <div style={{height: 4, width: lineWidth, background: COLORS.yellow, margin: '26px auto 0', borderRadius: 4}} />
        <div style={{color: '#fff', fontSize: 44, marginTop: 24, opacity: lineFade, fontWeight: 700}}>
          Where appreciation becomes culture
        </div>
      </div>

      <StickerBurst frames={120} startAt={10} />
    </AbsoluteFill>
  );
};
