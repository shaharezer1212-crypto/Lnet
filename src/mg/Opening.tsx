import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {OPENING_URL, OPENING_HOLD} from '../clips';

// The client's new opening: a 15s clip (top-down → the man's alert → reveal →
// the woman's alert). The footage is only 15s but the opening narration runs
// ~20.3s, and slow-motion is unwanted — so the footage plays at 1x and its
// final frame is held with a gentle cinematic push-in that begins just before
// the cut, masking the freeze while the voice-over finishes.
const VIDEO_FRAMES = 447; // ~14.9s @ 30fps — matches the extracted hold frame

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // gentle push-in: starts ~1s before the footage ends, continues across the
  // held final frame.
  const scale = interpolate(frame, [VIDEO_FRAMES - fps, VIDEO_FRAMES + fps * 5], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        {/* held final frame underneath */}
        <Img
          src={OPENING_HOLD}
          style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
        />
        {/* the footage on top, unmounted once it ends so the held frame shows */}
        <Sequence durationInFrames={VIDEO_FRAMES}>
          <OffthreadVideo
            src={OPENING_URL}
            muted
            style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
