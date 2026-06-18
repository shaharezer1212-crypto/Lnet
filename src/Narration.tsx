import {Audio, Sequence, staticFile} from 'remotion';
import {TIMELINE, START_FRAMES, NARRATION_VOLUME} from './clips';

// Phased narration (the client's chosen voice): one audio file per scene,
// each starting exactly when its scene begins. A segment that is longer than
// its own scene simply plays on across the following scenes until the next
// segment starts (e.g. the infographic line spans logo + criteria, and the
// ending line spans the three closing shots) — they are spaced so they never
// overlap.
export const Narration: React.FC = () => {
  return (
    <>
      {TIMELINE.map((beat, i) =>
        beat.narr ? (
          <Sequence key={beat.id} from={START_FRAMES[i]} name={`VO · ${beat.id}`}>
            <Audio src={staticFile(beat.narr)} volume={NARRATION_VOLUME} />
          </Sequence>
        ) : null,
      )}
    </>
  );
};
