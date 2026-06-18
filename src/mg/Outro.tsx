import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {Confetti, ShineText, ShockwaveRing, Stage} from './fx';
import {LOGO_URL} from '../clips';

// Closing KudoZ wordmark + tagline on the navy stage: the logo lands gently
// inside a soft glowing halo (emphasis, no white box), with a confetti burst
// and a shimmering tagline behind a wiped gold underline.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 16, mass: 0.8}});
  const scale = interpolate(pop, [0, 1], [0.75, 1]);
  const swing = Math.sin((frame / fps) * 1.4) * 1.2;
  const float = Math.sin((frame / fps) * 1.1) * 6;

  const haloIn = spring({frame: frame - 2, fps, config: {damping: 18, mass: 0.9}});
  const haloPulse = 0.85 + Math.sin((frame / fps) * 1.8) * 0.15;

  const lineGrow = spring({frame: frame - 22, fps, config: {damping: 20, mass: 0.9}});
  const lineWidth = lineGrow * 560;
  const lineFade = lineGrow;

  const logoW = 980;

  return (
    <Stage bokehSeed="outro">
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
        <ShockwaveRing at={6} max={1100} />
        <Confetti at={6} />

        {/* soft white→gold HALO behind the logo */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            width: 1320,
            height: 720,
            borderRadius: '50%',
            transform: `translateY(-50%) scale(${interpolate(haloIn, [0, 1], [0.6, 1])})`,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,${0.92 * haloIn}) 0%, rgba(255,238,188,${0.6 * haloIn}) 26%, rgba(255,196,46,${0.3 * haloIn}) 46%, rgba(255,196,46,0) 70%)`,
            filter: 'blur(34px)',
            opacity: haloPulse,
          }}
        />

        <div style={{textAlign: 'center', zIndex: 2}}>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              transform: `translateY(${float}px) scale(${scale}) rotate(${swing}deg)`,
            }}
          >
            <Img
              src={LOGO_URL}
              style={{
                width: logoW,
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.3))',
              }}
            />
          </div>
          <div
            style={{
              height: 4,
              width: lineWidth,
              background: COLORS.yellow,
              margin: '30px auto 0',
              borderRadius: 4,
              boxShadow: `0 0 16px ${COLORS.yellow}`,
            }}
          />
          <div style={{fontSize: 44, marginTop: 24, opacity: lineFade, fontWeight: 700}}>
            <ShineText base="#fff" highlight="rgba(255,196,46,0.95)" period={100}>
              Where appreciation becomes culture
            </ShineText>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
