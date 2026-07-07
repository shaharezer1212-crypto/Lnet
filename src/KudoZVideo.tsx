import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import type {TransitionPresentation} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {TIMELINE, TOTAL_FRAMES, transAt, sec, CLIP_VOLUME} from './clips';
import {Clip} from './Clip';
import {CleanContext} from './clean';
import {MusicBed} from './MusicBed';
import {Narration} from './Narration';
import {SceneTitle} from './mg/SceneTitle';
import {Intro} from './mg/Intro';
import {LogoReveal} from './mg/LogoReveal';
import {StoreShowcase} from './mg/StoreShowcase';
import {ScreensShowcase} from './mg/ScreensShowcase';
import {StoreScreens} from './mg/StoreScreens';
import {Criteria} from './mg/Criteria';
import {Outro} from './mg/Outro';

// Plain white placeholder — stands in for the graphics beats (middle) and the
// outro (end) in this music-only cut.
const White: React.FC = () => <AbsoluteFill style={{background: '#fff'}} />;

const MG = {
  intro: Intro,
  logo: LogoReveal,
  store: StoreShowcase,
  screens: ScreensShowcase,
  storescreens: StoreScreens,
  criteria: Criteria,
  outro: Outro,
  white: White,
} as const;

// A simple cross-dissolve — used into and out of the white placeholders so the
// fade to/from white reads cleanly.
const dissolve = (): TransitionPresentation<Record<string, unknown>> => ({
  component: ({presentationProgress, presentationDirection, children}) => {
    const opacity =
      presentationDirection === 'entering' ? presentationProgress : 1 - presentationProgress;
    return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
  },
  props: {},
});

const isWhite = (b: (typeof TIMELINE)[number]) => b.kind === 'mg' && b.mg === 'white';

// Playful directional pushes between live scenes; a soft dissolve into and out
// of the white placeholders.
const SLIDE_DIRS = ['from-bottom', 'from-right', 'from-left', 'from-top'] as const;
const presentationFor = (i: number): TransitionPresentation<Record<string, unknown>> => {
  if (isWhite(TIMELINE[i]) || isWhite(TIMELINE[i + 1])) return dissolve();
  return slide({direction: SLIDE_DIRS[i % SLIDE_DIRS.length]}) as TransitionPresentation<
    Record<string, unknown>
  >;
};

const Music = MusicBed;

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
                // Clean plate: every motion-graphics beat (logo intro, system
                // screens, store pause, logo reveal, outro) becomes a plain
                // white screen — only the AI scenes, narration and music remain.
                if (clean) {
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
