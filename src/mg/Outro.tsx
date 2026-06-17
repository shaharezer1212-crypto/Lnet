import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {FloatingMascots} from './FloatingMascots';
import {LOGO_URL} from '../clips';

// Closing logo + tagline on a clean white stage, with the stickers popping in.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 10, mass: 0.6}});
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const float = Math.sin((frame / fps) * 1.3) * 7;
  const lineFade = interpolate(frame, [22, 38], [0, 1], {extrapolateRight: 'clamp'});
  const lineWidth = interpolate(frame, [22, 44], [0, 540], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 42%, #FFFFFF 0%, #F2F7FF 100%)',
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `translateY(${float}px) scale(${scale})`, zIndex: 2}}>
        {LOGO_URL ? (
          <Img src={LOGO_URL} style={{height: 250, objectFit: 'contain'}} />
        ) : (
          <div style={{fontSize: 200, fontWeight: 900, lineHeight: 1, color: COLORS.zimBlue}}>
            Kudo<span style={{color: COLORS.yellow}}>Z</span>
          </div>
        )}
        <div style={{height: 4, width: lineWidth, background: COLORS.yellow, margin: '30px auto 0', borderRadius: 4}} />
        <div style={{color: COLORS.ink, fontSize: 42, marginTop: 26, opacity: lineFade, fontWeight: 700}}>
          Where appreciation becomes culture
        </div>
      </div>

      <FloatingMascots />
    </AbsoluteFill>
  );
};
