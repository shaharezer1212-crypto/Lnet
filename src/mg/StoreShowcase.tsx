import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../theme';
import {Stage} from './fx';
import {STORE_URL} from '../clips';

// Shows the real KudoZ store inside a clean browser window on the navy stage,
// with an animated mouse cursor that glides in and clicks a category (visual
// click only), before the edit cuts to the four values.
export const StoreShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const win = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const winScale = interpolate(win, [0, 1], [0.86, 1]);
  const winY = interpolate(win, [0, 1], [50, 0]);

  // cursor glides from lower-right toward a category, then clicks
  const clickFrame = 58;
  const move = spring({frame: frame - 14, fps, config: {damping: 18, mass: 0.9}});
  const cx = interpolate(move, [0, 1], [80, 50]); // %
  const cy = interpolate(move, [0, 1], [88, 56]); // %
  const press = interpolate(frame, [clickFrame, clickFrame + 5, clickFrame + 12], [1, 0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ring = interpolate(frame, [clickFrame, clickFrame + 20], [12, 110], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOp = interpolate(frame, [clickFrame, clickFrame + 20], [0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage bokehSeed="store">
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
        {/* browser window */}
        <div
          style={{
            width: '78%',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
            transform: `translateY(${winY}px) scale(${winScale})`,
            background: '#fff',
          }}
        >
          <div
            style={{
              height: 46,
              background: '#EAEEF5',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: 9,
            }}
          >
            <div style={{width: 13, height: 13, borderRadius: '50%', background: '#ff5f57'}} />
            <div style={{width: 13, height: 13, borderRadius: '50%', background: '#febc2e'}} />
            <div style={{width: 13, height: 13, borderRadius: '50%', background: '#28c840'}} />
            <div
              style={{
                flex: 1,
                height: 26,
                margin: '0 18px',
                borderRadius: 13,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 16,
                color: '#8a94a6',
                fontSize: 15,
              }}
            >
              kudoz.zim.com/store
            </div>
          </div>
          <Img src={STORE_URL} style={{width: '100%', display: 'block'}} />
        </div>

        {/* click ripple */}
        <div
          style={{
            position: 'absolute',
            left: `${cx}%`,
            top: `${cy}%`,
            width: ring,
            height: ring,
            borderRadius: '50%',
            border: '4px solid rgba(255,196,46,0.95)',
            transform: 'translate(-50%,-50%)',
            opacity: ringOp,
          }}
        />

        {/* cursor */}
        <div
          style={{
            position: 'absolute',
            left: `${cx}%`,
            top: `${cy}%`,
            transform: `translate(-8%,-6%) scale(${press})`,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))',
          }}
        >
          <svg width="42" height="42" viewBox="0 0 24 24">
            <path d="M5 3l14 7-6 1.5L11 18 5 3z" fill="#fff" stroke="#0B1B3A" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
