import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';

// "Introducing: KudoZ" — blurred-to-sharp logo reveal, matching the script's
// blue interstitial card.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12, mass: 0.6}});
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const blur = interpolate(frame, [0, 18], [22, 0], {extrapolateRight: 'clamp'});
  const subFade = interpolate(frame, [16, 30], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${COLORS.sky} 0%, ${COLORS.zimBlue} 45%, ${COLORS.zimBlueDeep} 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `scale(${scale})`, filter: `blur(${blur}px)`}}>
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 40,
            letterSpacing: 8,
            textTransform: 'uppercase',
            marginBottom: 18,
            opacity: subFade,
          }}
        >
          Introducing
        </div>
        <div style={{fontSize: 230, fontWeight: 900, lineHeight: 1, color: '#fff'}}>
          Kudo
          <span style={{color: COLORS.yellow}}>Z</span>
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.92)',
            fontSize: 38,
            marginTop: 22,
            opacity: subFade,
          }}
        >
          ZIM’s new employee recognition system
        </div>
      </div>
    </AbsoluteFill>
  );
};
