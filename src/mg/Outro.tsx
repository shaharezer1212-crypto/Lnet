import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';

// Closing logo + tagline: "Where appreciation becomes culture."
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 11, mass: 0.6}});
  const scale = interpolate(pop, [0, 1], [0.8, 1]);
  const lineFade = interpolate(frame, [20, 36], [0, 1], {extrapolateRight: 'clamp'});
  const lineWidth = interpolate(frame, [20, 40], [0, 520], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${COLORS.sky} 0%, ${COLORS.zimBlue} 50%, ${COLORS.zimBlueDeep} 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `scale(${scale})`}}>
        <div style={{fontSize: 220, fontWeight: 900, lineHeight: 1, color: '#fff'}}>
          Kudo
          <span style={{color: COLORS.yellow}}>Z</span>
        </div>
        <div
          style={{
            height: 4,
            width: lineWidth,
            background: COLORS.yellow,
            margin: '34px auto 0',
            borderRadius: 4,
          }}
        />
        <div style={{color: '#fff', fontSize: 44, marginTop: 30, opacity: lineFade, letterSpacing: 1}}>
          Where appreciation becomes culture
        </div>
      </div>
    </AbsoluteFill>
  );
};
