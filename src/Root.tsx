import {Composition} from 'remotion';
import {KudoZVideo} from './KudoZVideo';
import {FPS, WIDTH, HEIGHT, TOTAL_FRAMES} from './clips';

// Clean plate: same edit, but with no added text overlays and the screenshots
// sections as a plain white screen (narration + music kept).
const KudoZClean: React.FC = () => <KudoZVideo clean />;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KudoZ"
        component={KudoZVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="KudoZClean"
        component={KudoZClean}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
