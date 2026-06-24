import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {ShineText} from './fx';

// A premium animated on-screen title in the brand font (Magistral). The phrase
// is split into a small white "lead" and a large, colour-shimmering "hero"
// phrase (the last `emphasize` words). `angled` projects the whole title onto
// the scene's wall in perspective. `frames` is the host-scene length (exit).
export const SceneTitle: React.FC<{
  text: string;
  frames: number;
  startAt?: number;
  position?: 'bottom' | 'left';
  emphasize?: number;
  angled?: boolean;
}> = ({text, frames, startAt = 8, position = 'bottom', emphasize = 1, angled = false}) => {
  const left = position === 'left' || angled;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const words = text.split(' ');
  const heroCount = Math.min(Math.max(emphasize, 0), words.length);
  const lead = words.slice(0, words.length - heroCount);
  const hero = words.slice(words.length - heroCount);

  const outStart = frames - 22;
  const out = interpolate(frame, [outStart, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupY = interpolate(out, [0, 1], [0, -30]);
  const groupFade = 1 - out;

  // hero phrase: scale-settle + a left→right wipe reveal
  const heroIn = spring({frame: frame - startAt - lead.length * 5, fps, config: {damping: 15, mass: 0.9}});
  const heroScale = interpolate(heroIn, [0, 1], [0.82, 1]);
  const wipe = interpolate(heroIn, [0, 1], [0, 100]);

  const accent = spring({frame: frame - startAt - 2, fps, config: {damping: 18, mass: 0.8}});

  const HERO_SIZE = angled ? 132 : 112;
  const LEAD_SIZE = angled ? 48 : 56;

  const wallTransform = angled
    ? 'perspective(1500px) rotateY(-19deg) rotateX(4deg)'
    : 'none';

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: left ? 'flex-start' : 'center',
        justifyContent: left ? 'center' : 'flex-end',
        paddingBottom: left ? 0 : 132,
        paddingLeft: left ? 120 : 0,
        pointerEvents: 'none',
      }}
    >
      {/* soft scrim so the type reads on bright footage (skipped when angled —
          there the text should look painted on the wall) */}
      {!angled ? (
        <AbsoluteFill
          style={{
            background: left
              ? 'linear-gradient(90deg, rgba(3,16,40,0.55) 0%, rgba(3,16,40,0) 52%)'
              : 'linear-gradient(0deg, rgba(3,16,40,0.6) 0%, rgba(3,16,40,0) 38%)',
            opacity: groupFade,
          }}
        />
      ) : null}

      <div
        style={{
          transform: `${wallTransform} translateY(${groupY}px)`,
          transformOrigin: 'left center',
          opacity: groupFade,
          textAlign: left ? 'left' : 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: left ? 'flex-start' : 'center',
          gap: 6,
        }}
      >
        {/* lead words — small, white, staggered rise */}
        {lead.length ? (
          <div style={{display: 'flex', flexDirection: 'row', gap: 14, flexWrap: 'wrap'}}>
            {lead.map((w, i) => {
              const enter = spring({frame: frame - startAt - i * 5, fps, config: {damping: 16, mass: 0.9}});
              const y = interpolate(enter, [0, 1], [40, 0]);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${y}px)`,
                    opacity: enter,
                    fontSize: LEAD_SIZE,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: 1,
                    textShadow: '0 6px 24px rgba(0,0,0,0.55)',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ) : null}

        {/* gold accent bar that wipes in under/with the hero phrase */}
        <div
          style={{
            height: 6,
            width: interpolate(accent, [0, 1], [0, angled ? 220 : 170]),
            background: 'linear-gradient(90deg, #FFD86B, #FFB01E)',
            borderRadius: 6,
            boxShadow: '0 0 18px rgba(255,196,46,0.8)',
            margin: left ? '4px 0 6px' : '4px auto 8px',
          }}
        />

        {/* hero phrase — large, colour-shimmering, wipe reveal */}
        <div
          style={{
            position: 'relative',
            transform: `scale(${heroScale})`,
            transformOrigin: left ? 'left center' : 'center',
            clipPath: `inset(0 ${100 - wipe}% 0 0)`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: HERO_SIZE,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: 0.5,
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(255,176,30,0.45))',
            }}
          >
            <ShineText
              base="#FFC42E"
              highlight="#FFF4CC"
              period={80}
              style={{fontSize: HERO_SIZE, fontWeight: 900}}
            >
              {hero.join(' ')}
            </ShineText>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
