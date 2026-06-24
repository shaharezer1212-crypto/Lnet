import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {BrandStage, ShockwaveRing} from './fx';
import {LOGO_URL, SCREENS_BG} from '../clips';

// Opening brand sting: the KudoZ logo lands on the navy stage inside a soft
// glowing halo, a glint sweeps across, then it settles — a clean intro before
// the film begins.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame: frame - 6, fps, config: {damping: 12, mass: 0.9}});
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const float = Math.sin((frame / fps) * 1.1) * 5;

  const haloIn = spring({frame: frame - 8, fps, config: {damping: 18, mass: 0.9}});
  const haloPulse = 0.85 + Math.sin((frame / fps) * 1.8) * 0.15;

  const logoW = 1180;
  const shineX = interpolate(frame, [24, 56], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <BrandStage bg={SCREENS_BG} bokehSeed="intro">
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
        <ShockwaveRing at={10} />

        {/* soft white→gold halo */}
        <div
          style={{
            position: 'absolute',
            width: 1560,
            height: 900,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(255,255,255,${0.92 * haloIn}) 0%, rgba(255,238,188,${0.6 * haloIn}) 26%, rgba(255,196,46,${0.3 * haloIn}) 46%, rgba(255,196,46,0) 70%)`,
            filter: 'blur(38px)',
            opacity: haloPulse,
            transform: `scale(${interpolate(haloIn, [0, 1], [0.6, 1])})`,
          }}
        />

        <div
          style={{
            position: 'relative',
            transform: `translateY(${float}px) scale(${scale})`,
            opacity: pop,
            zIndex: 2,
          }}
        >
          <Img
            src={LOGO_URL}
            style={{
              width: logoW,
              maxHeight: 480,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.3))',
            }}
          />
          <AbsoluteFill style={{overflow: 'hidden'}}>
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: `${shineX}%`,
                width: '22%',
                height: '160%',
                transform: 'rotate(16deg)',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)',
                filter: 'blur(8px)',
                mixBlendMode: 'screen',
              }}
            />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </BrandStage>
  );
};
