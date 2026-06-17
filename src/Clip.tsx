import {AbsoluteFill, OffthreadVideo} from 'remotion';
import {COLORS, FONT} from './theme';

// Renders a Higgsfield live-action clip. If the url is not yet filled in
// (a clip still re-rendering), shows a labelled placeholder card so the
// timeline still previews/renders end-to-end.
export const Clip: React.FC<{url: string; label: string; volume?: number}> = ({
  url,
  label,
  volume = 1,
}) => {
  if (!url) {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.zimBlue}, ${COLORS.zimBlueDeep})`,
          fontFamily: FONT,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          gap: 16,
        }}
      >
        <div style={{fontSize: 40, opacity: 0.6, letterSpacing: 4}}>RENDERING…</div>
        <div style={{fontSize: 30, opacity: 0.9}}>{label}</div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo
        src={url}
        volume={volume}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </AbsoluteFill>
  );
};
