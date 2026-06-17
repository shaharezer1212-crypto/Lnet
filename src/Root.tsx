import {Composition} from 'remotion';
import {KudoZVideo} from './KudoZVideo';
import {FPS, WIDTH, HEIGHT, TOTAL_FRAMES} from './clips';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KudoZ"
      component={KudoZVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
