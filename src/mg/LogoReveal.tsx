import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONT} from '../theme';
import {FloatingMascots} from './FloatingMascots';
import {LOGO_URL, FOOTAGE_URL} from '../clips';

// "Introducing: KudoZ" — centered logo reveal, a placeholder screen for the
// work-environment footage, and playful KudoZ mascots floating around.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12, mass: 0.6}});
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const blur = interpolate(frame, [0, 18], [22, 0], {extrapolateRight: 'clamp'});
  const subFade = interpolate(frame, [16, 30], [0, 1], {extrapolateRight: 'clamp'});
  const panelFade = interpolate(frame, [24, 40], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${COLORS.sky} 0%, ${COLORS.zimBlue} 45%, ${COLORS.zimBlueDeep} 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `scale(${scale})`, filter: `blur(${blur}px)`, zIndex: 2}}>
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 34,
            letterSpacing: 8,
            textTransform: 'uppercase',
            marginBottom: 14,
            opacity: subFade,
          }}
        >
          Introducing
        </div>
        {LOGO_URL ? (
          <Img src={LOGO_URL} style={{height: 200, objectFit: 'contain'}} />
        ) : (
          <div style={{fontSize: 190, fontWeight: 900, lineHeight: 1, color: '#fff'}}>
            Kudo<span style={{color: COLORS.yellow}}>Z</span>
          </div>
        )}
        <div style={{color: 'rgba(255,255,255,0.92)', fontSize: 34, marginTop: 18, opacity: subFade}}>
          ZIM’s new employee recognition system
        </div>
      </div>

      {/* Work-environment footage placeholder (replaced when FOOTAGE_URL is set) */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          width: 460,
          height: 150,
          borderRadius: 16,
          overflow: 'hidden',
          opacity: panelFade,
          border: '3px dashed rgba(255,255,255,0.55)',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 22,
          letterSpacing: 2,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        {FOOTAGE_URL ? (
          <OffthreadVideo src={FOOTAGE_URL} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <span>▶ WORK-ENVIRONMENT FOOTAGE<br />(placeholder)</span>
        )}
      </div>

      <FloatingMascots />
    </AbsoluteFill>
  );
};
