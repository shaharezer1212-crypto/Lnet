import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';
import {LightSweep, ShineText, ShockwaveRing, Stage} from './fx';
import {LOGO_URL} from '../clips';

// Cinematic close-up reveal of the gold KudoZ medal: it punches in from an
// oversized close-up, lands with a shockwave + glint, settles into a gentle
// swing inside a golden glow — premium "ad" energy, not a slide.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // overshoot landing
  const pop = spring({frame, fps, config: {damping: 11, mass: 0.9}});
  const scale = interpolate(pop, [0, 1], [2.1, 1]); // bold close-up → settle
  const settle = spring({frame: frame - 16, fps, config: {damping: 9, mass: 0.6}});
  const swing = Math.sin((frame / fps) * 1.5) * 2 * (1 - settle * 0.4);
  const glow = 0.5 + Math.sin((frame / fps) * 2) * 0.2;
  const float = Math.sin((frame / fps) * 1.1) * 8; // subtle bob once settled

  const kicker = interpolate(frame, [8, 22], [0, 1], {extrapolateRight: 'clamp'});
  const kickerY = interpolate(frame, [8, 22], [24, 0], {extrapolateRight: 'clamp'});
  const sub = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});
  const subY = interpolate(frame, [30, 46], [22, 0], {extrapolateRight: 'clamp'});
  const lineW = interpolate(frame, [22, 44], [0, 360], {extrapolateRight: 'clamp'});

  const logoH = 620;

  return (
    <Stage bokehSeed="logo">
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
        {/* INTRODUCING kicker with animated underline */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            textAlign: 'center',
            opacity: kicker,
            transform: `translateY(${kickerY}px)`,
          }}
        >
          <ShineText
            base={COLORS.yellow}
            highlight="#fff"
            period={70}
            style={{
              fontSize: 30,
              letterSpacing: 14,
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Introducing
          </ShineText>
          <div
            style={{
              height: 3,
              width: lineW,
              background: COLORS.yellow,
              margin: '14px auto 0',
              borderRadius: 3,
              boxShadow: `0 0 14px ${COLORS.yellow}`,
            }}
          />
        </div>

        {/* shockwave fired as the medal lands */}
        <ShockwaveRing at={10} />

        {/* golden glow behind the medal */}
        <div
          style={{
            position: 'absolute',
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,196,46,${glow}) 0%, rgba(255,196,46,0) 60%)`,
            filter: 'blur(22px)',
          }}
        />

        {/* the hero medal + a glint sweeping across it */}
        <div
          style={{
            position: 'relative',
            transform: `translateY(${float}px) scale(${scale}) rotate(${swing}deg)`,
            zIndex: 2,
          }}
        >
          <Img
            src={LOGO_URL}
            style={{
              height: logoH,
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
              display: 'block',
            }}
          />
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <LightSweep size={logoH} at={20} duration={28} />
          </AbsoluteFill>
        </div>

        {/* subtitle */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            color: '#fff',
            fontSize: 36,
            fontWeight: 600,
            opacity: sub,
            transform: `translateY(${subY}px)`,
            letterSpacing: 1,
            textShadow: '0 4px 22px rgba(0,0,0,0.5)',
          }}
        >
          ZIM’s new employee recognition system
        </div>

        <StickerBurst frames={180} startAt={16} count={3} size={250} />
      </AbsoluteFill>
    </Stage>
  );
};
