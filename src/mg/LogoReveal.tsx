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

// "Introducing: KudoZ" on a clean white stage — the logo springs in with a
// shine sweep, the work-environment footage placeholder fades in, and the
// KudoZ stickers pop around it.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 10, mass: 0.6}});
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const float = Math.sin(frame / fps * 1.4) * 8;
  const subFade = interpolate(frame, [16, 30], [0, 1], {extrapolateRight: 'clamp'});
  const panelFade = interpolate(frame, [26, 42], [0, 1], {extrapolateRight: 'clamp'});
  // shine sweep across the logo
  const shine = interpolate(frame, [10, 34], [-140, 260], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F2F7FF 100%)',
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `translateY(${float}px) scale(${scale})`, zIndex: 2}}>
        <div
          style={{
            color: COLORS.sky,
            fontSize: 30,
            letterSpacing: 10,
            textTransform: 'uppercase',
            marginBottom: 18,
            opacity: subFade,
            fontWeight: 700,
          }}
        >
          Introducing
        </div>

        <div style={{position: 'relative', display: 'inline-block', overflow: 'hidden', borderRadius: 18}}>
          <Img src={LOGO_URL} style={{height: 260, objectFit: 'contain', display: 'block'}} />
          {/* glossy shine sweep */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: shine,
              width: 90,
              transform: 'skewX(-18deg)',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        <div style={{color: COLORS.ink, fontSize: 34, marginTop: 22, opacity: subFade, fontWeight: 600}}>
          ZIM’s new employee recognition system
        </div>
      </div>

      {/* Work-environment footage placeholder (replaced when FOOTAGE_URL is set) */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          width: 460,
          height: 150,
          borderRadius: 16,
          overflow: 'hidden',
          opacity: panelFade,
          border: `3px dashed ${COLORS.sky}`,
          background: 'rgba(46,143,230,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.sky,
          fontSize: 22,
          letterSpacing: 2,
          textAlign: 'center',
          zIndex: 2,
          fontWeight: 700,
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
