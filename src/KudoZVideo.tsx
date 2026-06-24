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
import {Narration} from './Narration';
import {SceneTitle} from './mg/SceneTitle';
import {Intro} from './mg/Intro';
import {LogoReveal} from './mg/LogoReveal';
import {StoreShowcase} from './mg/StoreShowcase';
import {Criteria} from './mg/Criteria';
import {Outro} from './mg/Outro';

const MG = {intro: Intro, logo: LogoReveal, store: StoreShowcase, criteria: Criteria, outro: Outro} as const;

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

// Playful directional pushes — each cut comes from a different side so the
// edit keeps moving (one from the bottom, the next from the side, ...).
const SLIDE_DIRS = ['from-bottom', 'from-right', 'from-left', 'from-top'] as const;
const presentationFor = (i: number): TransitionPresentation<Record<string, unknown>> => {
  // opening → scene 2: the cinematic zoom-punch CUT (no fade/dim).
  if (i === 0) return cut();
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

export const KudoZVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        {TIMELINE.flatMap((beat, i) => {
          const Segment =
            beat.kind === 'mg' ? (
              (() => {
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
                {beat.title ? (
                  <SceneTitle
                    text={beat.title}
                    frames={sec(beat.seconds)}
                    position={beat.titlePos}
                    startAt={beat.titleStart}
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
  );
};
