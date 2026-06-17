import {AbsoluteFill, Audio, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {
  TIMELINE,
  TRANSITION,
  TOTAL_FRAMES,
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

// Snappy directional slides between segments for an energetic, "popping" cut.
const SLIDE_DIRS = ['from-right', 'from-left', 'from-bottom', 'from-top'] as const;

// Background music, ducked under the narration, with a short fade in/out.
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

// Black fade-in at the very start and fade-out at the very end.
const BlackFades: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [1, 0], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 14, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{background: '#000', opacity: Math.max(fadeIn, fadeOut), pointerEvents: 'none'}}
    />
  );
};

// Assembles every beat into one continuous piece with snappy slide cuts, plus
// the music bed and the single continuous voice-over.
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
                presentation={slide({direction: SLIDE_DIRS[i % SLIDE_DIRS.length]})}
                timing={linearTiming({durationInFrames: TRANSITION})}
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
