import {AbsoluteFill, Audio, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import type {TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {
  TIMELINE,
  TRANSITION,
  TOTAL_FRAMES,
  START_FRAMES,
  sec,
  MUSIC_URL,
  MUSIC_VOLUME,
  CLIP_VOLUME,
} from './clips';
import {Clip} from './Clip';
import {Narration} from './Narration';
import {LogoReveal} from './mg/LogoReveal';
import {Criteria} from './mg/Criteria';
import {Outro} from './mg/Outro';

const MG = {logo: LogoReveal, criteria: Criteria, outro: Outro} as const;

// Cinematic, mostly-fade cuts that keep scenes connected, with a wipe/slide
// to punctuate the section changes (into the logo, back to live action, and
// into the outro). Same duration everywhere so the timeline stays exact.
const presentationFor = (cut: number): TransitionPresentation<Record<string, unknown>> => {
  if (cut === 5 || cut === 11) return wipe() as TransitionPresentation<Record<string, unknown>>;
  if (cut === 7) return slide({direction: 'from-right'}) as TransitionPresentation<Record<string, unknown>>;
  return fade() as TransitionPresentation<Record<string, unknown>>;
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

// Quick white flash at every scene boundary — a trailer-style "flash cut".
const FlashCuts: React.FC = () => {
  const frame = useCurrentFrame();
  let o = 0;
  for (let i = 1; i < START_FRAMES.length; i++) {
    const d = Math.abs(frame - START_FRAMES[i]);
    if (d < 6) o = Math.max(o, interpolate(d, [0, 6], [0.6, 0], {extrapolateRight: 'clamp'}));
  }
  return (
    <AbsoluteFill style={{background: '#fff', opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />
  );
};

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
              <Clip url={beat.url} label={beat.label} volume={beat.volume ?? CLIP_VOLUME} />
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
                timing={linearTiming({durationInFrames: TRANSITION})}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>

      <Music />
      <Narration />
      <FlashCuts />
      <BlackFades />
    </AbsoluteFill>
  );
};
