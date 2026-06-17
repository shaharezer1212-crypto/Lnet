import {AbsoluteFill, Audio, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
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

// Background music, ducked under the narration, with a short fade in/out.
const Music: React.FC = () => {
  const frame = useCurrentFrame();
  if (!MUSIC_URL) return null;
  const fadeVol = interpolate(
    frame,
    [0, 20, TOTAL_FRAMES - 30, TOTAL_FRAMES],
    [0, MUSIC_VOLUME, MUSIC_VOLUME, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return <Audio src={MUSIC_URL} volume={fadeVol} />;
};

// Assembles every beat into one continuous piece, with a clean cross-fade
// between each segment, plus the music bed and the synced voice-over.
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
              <Clip url={beat.url} label={beat.label} volume={CLIP_VOLUME} />
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
                presentation={fade()}
                timing={linearTiming({durationInFrames: TRANSITION})}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>

      <Music />
      <Narration />
    </AbsoluteFill>
  );
};
