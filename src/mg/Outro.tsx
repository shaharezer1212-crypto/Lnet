import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {Confetti, LightSweep, ShineText, ShockwaveRing, Stage} from './fx';
import {LOGO_URL} from '../clips';

// Closing logo + tagline on the brand stage: the medal pops with a confetti
// burst + glint, the tagline shimmers in behind a wiped gold underline.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // gentle landing — low overshoot so the lockup doesn't visibly bounce/jump
  const pop = spring({frame, fps, config: {damping: 16, mass: 0.8}});
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const swing = Math.sin((frame / fps) * 1.4) * 2;
  const float = Math.sin((frame / fps) * 1.1) * 7;
  const glow = 0.5 + Math.sin((frame / fps) * 2) * 0.2;
  // the underline grows on an eased spring (no abrupt snap) and the tagline
  // fades in with it — fully decoupled from layout so nothing shifts vertically
  const lineGrow = spring({frame: frame - 20, fps, config: {damping: 20, mass: 0.9}});
  const lineWidth = lineGrow * 560;
  const lineFade = lineGrow;

  const logoH = 420;

  return (
    <Stage bokehSeed="outro">
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
        <ShockwaveRing at={6} max={1100} />
        <Confetti at={6} />

        <div
          style={{
            position: 'absolute',
            width: 660,
            height: 660,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,196,46,${glow}) 0%, rgba(255,196,46,0) 60%)`,
            filter: 'blur(20px)',
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
                height: logoH,
                objectFit: 'contain',
                filter: 'drop-shadow(0 26px 54px rgba(0,0,0,0.5))',
                display: 'block',
              }}
            />
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
              <LightSweep size={logoH} at={14} duration={26} />
            </AbsoluteFill>
          </div>
          <div
            style={{
              height: 4,
              width: lineWidth,
              background: COLORS.yellow,
              margin: '26px auto 0',
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
