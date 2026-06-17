import {Audio, Sequence} from 'remotion';
import {NARRATION_URL, NARRATION_START, NARRATION_VOLUME} from './clips';

// A SINGLE continuous Ashley voice-over track for the whole film.
// One file → the lines can never overlap or "run over" each other, and the
// narration flows naturally over the montage (per-beat placement is gone).
export const Narration: React.FC = () => {
  if (!NARRATION_URL) return null;
  return (
    <Sequence from={NARRATION_START} name="Narration (continuous)">
      <Audio src={NARRATION_URL} volume={NARRATION_VOLUME} />
    </Sequence>
  );
};
