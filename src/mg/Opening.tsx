import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {OPENING_URL, OPENING_HOLD} from '../clips';

// The new opening: the client's lobby→lounge entrance clip (~5s) joined with the
// recognition footage (man's notification → reveal → woman, ~15s) — all at 1x,
// no slow-motion. The combined clip is ~20s ≈ the opening VO, so only its final
// ~0.9s is held (with a whisper of push-in) while the last words land.
const VIDEO_FRAMES = 602; // ~20.07s @ 30fps

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [VIDEO_FRAMES, VIDEO_FRAMES + 40], [1, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
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
