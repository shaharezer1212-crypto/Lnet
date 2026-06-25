import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {OPENING_URL, OPENING_HOLD} from '../clips';

// The client's new opening: a 15s clip (top-down → the man's alert → reveal →
// the woman's alert). Played slightly fast (1.4x) for a punchier pace so the
// woman's recognition lands earlier — by the time the VO reaches "recognition"
// she is already being recognised. Its final frame is then held with a gentle
// cinematic push-in while the ~20s opening narration finishes (no slow-motion).
const PLAYBACK = 1.4;
const VIDEO_FRAMES = Math.round((15.069 / PLAYBACK) * 30); // sped clip end (~323f)

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
            playbackRate={PLAYBACK}
            style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
