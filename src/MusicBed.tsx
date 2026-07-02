import {AbsoluteFill, Audio, interpolate, useCurrentFrame} from 'remotion';
import {MUSIC_URL, MUSIC_VOLUME, TOTAL_FRAMES} from './clips';

// The background-music bed exactly as it plays in the film: the same source
// track at MUSIC_VOLUME with a fade-in at the start and a fade-out at the end,
// running the full length of the edit. Used both inside the video and as the
// standalone "music as heard in the video" render.
export const MusicBed: React.FC = () => {
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

// Audio-only composition body: the music bed, one-to-one with the video.
export const MusicOnly: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <MusicBed />
  </AbsoluteFill>
);
