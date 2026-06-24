import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../theme';
import {StickerBurst} from './StickerBurst';
import {BrandStage, ShineText, ShockwaveRing} from './fx';
import {LOGO_WHITE_URL, SCREENS_BG} from '../clips';

// Cinematic reveal of the KudoZ wordmark on the deep-navy stage. Because the
// "Kudo" lettering is navy, the logo sits inside a soft glowing white/gold HALO
// that lifts and emphasises it (no white box) — it punches in, lands on a
// shockwave, a glint sweeps across, and it settles with a gentle float.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12, mass: 0.9}});
  const scale = interpolate(pop, [0, 1], [1.5, 1]); // wide wordmark → settle
  const float = Math.sin((frame / fps) * 1.1) * 6;
  const swing = Math.sin((frame / fps) * 1.4) * 1.2;

  const haloIn = spring({frame: frame - 4, fps, config: {damping: 18, mass: 0.9}});
  const haloPulse = 0.85 + Math.sin((frame / fps) * 1.8) * 0.15;

  const kicker = interpolate(frame, [8, 22], [0, 1], {extrapolateRight: 'clamp'});
  const kickerY = interpolate(frame, [8, 22], [24, 0], {extrapolateRight: 'clamp'});
  const sub = interpolate(frame, [34, 50], [0, 1], {extrapolateRight: 'clamp'});
  const subY = interpolate(frame, [34, 50], [22, 0], {extrapolateRight: 'clamp'});
  const lineW = interpolate(frame, [22, 44], [0, 360], {extrapolateRight: 'clamp'});

  const logoW = 1100;
  const shineX = interpolate(frame, [24, 54], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <BrandStage bg={SCREENS_BG} bokehSeed="logo">
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
        {/* INTRODUCING kicker with animated underline */}
        <div
          style={{
            position: 'absolute',
            top: 110,
            textAlign: 'center',
            opacity: kicker,
            transform: `translateY(${kickerY}px)`,
          }}
        >
          <ShineText
            base={COLORS.yellow}
            highlight="#fff"
            period={70}
            style={{fontSize: 30, letterSpacing: 14, textTransform: 'uppercase', fontWeight: 800}}
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

        <ShockwaveRing at={8} />

        {/* soft gold bloom (no white core) so the white wordmark reads on top */}
        <div
          style={{
            position: 'absolute',
            width: 1480,
            height: 860,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(255,200,70,${0.5 * haloIn}) 0%, rgba(255,168,38,${0.4 * haloIn}) 32%, rgba(255,140,20,${0.16 * haloIn}) 52%, rgba(255,140,20,0) 72%)`,
            filter: 'blur(40px)',
            opacity: haloPulse,
            transform: `scale(${interpolate(haloIn, [0, 1], [0.6, 1])})`,
          }}
        />

        {/* the wordmark + a glint sweeping across it */}
        <div
          style={{
            position: 'relative',
            transform: `translateY(${float}px) scale(${scale}) rotate(${swing}deg)`,
            zIndex: 2,
          }}
        >
          <Img
            src={LOGO_WHITE_URL}
            style={{
              width: logoW,
              maxHeight: 460,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 16px 38px rgba(0,0,0,0.55))',
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

        {/* subtitle — enlarged and lifted higher */}
        <div
          style={{
            position: 'absolute',
            bottom: 210,
            color: '#fff',
            fontSize: 56,
            fontWeight: 800,
            opacity: sub,
            transform: `translateY(${subY}px)`,
            letterSpacing: 1,
            textAlign: 'center',
            textShadow: '0 6px 26px rgba(0,0,0,0.6)',
          }}
        >
          ZIM’s new employee recognition system
        </div>

        <StickerBurst frames={180} startAt={16} count={3} size={250} />
      </AbsoluteFill>
    </BrandStage>
  );
};
