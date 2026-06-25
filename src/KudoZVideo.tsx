import {AbsoluteFill, Audio, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import type {TransitionPresentation} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {
  TIMELINE,
  TOTAL_FRAMES,
  transAt,
  sec,
  MUSIC_URL,
  MUSIC_VOLUME,
  CLIP_VOLUME,
} from './clips';
import {Clip} from './Clip';
import {CleanContext} from './clean';
import {Narration} from './Narration';
import {SceneTitle} from './mg/SceneTitle';
import {Intro} from './mg/Intro';
import {LogoReveal} from './mg/LogoReveal';
import {StoreShowcase} from './mg/StoreShowcase';
import {ScreensShowcase} from './mg/ScreensShowcase';
import {StoreScreens} from './mg/StoreScreens';
import {Criteria} from './mg/Criteria';
import {Outro} from './mg/Outro';

const MG = {
  intro: Intro,
  logo: LogoReveal,
  store: StoreShowcase,
  screens: ScreensShowcase,
  storescreens: StoreScreens,
  criteria: Criteria,
  outro: Outro,
} as const;

// A cinematic hard cut with a little energy: the outgoing shot plays to the
// slot's midpoint, then we snap to the incoming shot which "punches in" with a
// quick zoom-settle — no dissolve, no dim, no flash. Still occupies the
// constant TRANSITION slot so the timeline math stays exact.
const cut = (): TransitionPresentation<Record<string, unknown>> => ({
  component: ({presentationProgress, presentationDirection, children}) => {
    const entering = presentationDirection === 'entering';
    const show = entering ? presentationProgress >= 0.5 : presentationProgress < 0.5;
    const punch = entering
      ? interpolate(presentationProgress, [0.5, 0.74], [1.08, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
    return (
      <AbsoluteFill style={{opacity: show ? 1 : 0, transform: `scale(${punch})`}}>
        {children}
      </AbsoluteFill>
    );
  },
  props: {},
});

// A screen dim: the logo intro fades down to black, a brief black beat, then
// the film fades up — a soft cinematic open into the movie.
const dipToBlack = (): TransitionPresentation<Record<string, unknown>> => ({
  component: ({presentationProgress, presentationDirection, children}) => {
    const opacity =
      presentationDirection === 'entering'
        ? interpolate(presentationProgress, [0.55, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : interpolate(presentationProgress, [0, 0.45], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
    return (
      <AbsoluteFill style={{backgroundColor: '#000'}}>
        <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  },
  props: {},
});

// A simple cross-dissolve — used between the two blue brand screens (the system
// screens → the online-store pause) where a directional slide would look odd.
const dissolve = (): TransitionPresentation<Record<string, unknown>> => ({
  component: ({presentationProgress, presentationDirection, children}) => {
    const opacity =
      presentationDirection === 'entering' ? presentationProgress : 1 - presentationProgress;
    return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
  },
  props: {},
});

// Playful directional pushes — each cut comes from a different side so the
// edit keeps moving (one from the bottom, the next from the side, ...).
const SLIDE_DIRS = ['from-bottom', 'from-right', 'from-left', 'from-top'] as const;
const presentationFor = (i: number): TransitionPresentation<Record<string, unknown>> => {
  // intro → opening: a soft screen dim (not a cut).
  if (i === 0) return dipToBlack();
  // opening → scene 2: the cinematic zoom-punch CUT (no fade/dim).
  if (i === 1) return cut();
  // the system screens → online-store pause: both blue, so cross-dissolve.
  if (TIMELINE[i].id === 'mg-screens') return dissolve();
  return slide({direction: SLIDE_DIRS[i % SLIDE_DIRS.length]}) as TransitionPresentation<
    Record<string, unknown>
  >;
};

const Music: React.FC = () => {
  const frame = useCurrentFrame();
  if (!MUSIC_URL) return null;
  const vol = interpolate(
    frame,
    [0, 20, TOTAL_FRAMES - 30, TOTAL_FRAMES],
    [0, MUSIC_VOLUME, MUSIC_VOLUME, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return <Audio src={MUSIC_URL} volume={vol} />;
};

// Gentle fade-in from black at the very start and fade-out at the very end.
const BlackFades: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 30], [1, 0], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 16, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{background: '#000', opacity: Math.max(fadeIn, fadeOut), pointerEvents: 'none'}}
    />
  );
};

export const KudoZVideo: React.FC<{clean?: boolean}> = ({clean = false}) => {
  return (
    <CleanContext.Provider value={clean}>
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        {TIMELINE.flatMap((beat, i) => {
          const Segment =
            beat.kind === 'mg' ? (
              (() => {
                // Clean plate: the screenshots sections (system screens + the
                // online-store pause) become a plain white screen.
                if (clean && (beat.mg === 'screens' || beat.mg === 'storescreens')) {
                  return <AbsoluteFill style={{background: '#fff'}} />;
                }
                const Comp = MG[beat.mg];
                return <Comp />;
              })()
            ) : (
              <>
                <Clip
                  url={beat.url}
                  label={beat.label}
                  volume={beat.volume ?? CLIP_VOLUME}
                  playbackRate={beat.playbackRate}
                />
                {beat.title && !clean ? (
                  <SceneTitle
                    text={beat.title}
                    frames={sec(beat.seconds)}
                    position={beat.titlePos}
                    startAt={beat.titleStart}
                    emphasize={beat.titleEmphasis}
                    angled={beat.titleAngled}
                  />
                ) : null}
              </>
            );

          const nodes = [
            <TransitionSeries.Sequence key={beat.id} durationInFrames={sec(beat.seconds)}>
              {Segment}
            </TransitionSeries.Sequence>,
          ];

          if (i < TIMELINE.length - 1) {
            nodes.push(
              <TransitionSeries.Transition
                key={`${beat.id}-t`}
                presentation={presentationFor(i)}
                timing={linearTiming({durationInFrames: transAt(i)})}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>

      <Music />
      <Narration />
      <BlackFades />
    </AbsoluteFill>
    </CleanContext.Provider>
  );
};
