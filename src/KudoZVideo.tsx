import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {TIMELINE, TRANSITION, sec} from './clips';
import {Clip} from './Clip';
import {LogoReveal} from './mg/LogoReveal';
import {Criteria} from './mg/Criteria';
import {Outro} from './mg/Outro';

const MG = {logo: LogoReveal, criteria: Criteria, outro: Outro} as const;

// Assembles every beat into one continuous piece, with a clean cross-fade
// between each segment (clips keep their own diegetic Seedance audio).
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
              <Clip url={beat.url} label={beat.label} />
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
    </AbsoluteFill>
  );
};
