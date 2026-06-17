import {Audio, Sequence} from 'remotion';
import {TIMELINE, START_FRAMES} from './clips';

// Lays each beat's Ashley (en) voice-over at that beat's absolute start frame.
// Each line plays its full natural length (it may breathe slightly past the
// cut, which reads naturally over the next shot).
export const Narration: React.FC = () => {
  return (
    <>
      {TIMELINE.map((beat, i) =>
        beat.vo ? (
          <Sequence key={beat.id} from={START_FRAMES[i]} name={`VO · ${beat.label}`}>
            <Audio src={beat.vo} />
          </Sequence>
        ) : null,
      )}
    </>
  );
};
