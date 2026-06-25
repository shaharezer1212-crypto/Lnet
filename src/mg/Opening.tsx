import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {OPENING_URL, OPENING_HOLD} from '../clips';

// The client's new opening, baked with a variable speed: a slow cinematic
// camera entrance, generous time on the man receiving his notification, then a
// brief end on the woman's recognition (no long dwell on her). The footage is
// ~20s — almost exactly the opening VO — so only its final ~1s is held (with a
// whisper of push-in) while the voice-over lands.
const VIDEO_FRAMES = 599; // ~19.97s @ 30fps

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [VIDEO_FRAMES, VIDEO_FRAMES + 40], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        {/* held final frame underneath as a safety once the footage ends */}
        <Img
          src={OPENING_HOLD}
          style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
        />
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
