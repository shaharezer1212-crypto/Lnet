import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";

// Scene-2 "we got stuck" moment: the clip plays, then freezes on its last
// frame with a TV-interference glitch and a "signal stuck" sound effect.
export const FreezeScene: React.FC<{
  src: string;
  durationInFrames: number;
  muted?: boolean;
}> = ({ src, durationInFrames, muted = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const freezeFrames = Math.round(0.85 * fps);
  const freezePoint = Math.max(1, durationInFrames - freezeFrames);
  const frozen = frame >= freezePoint;

  // jitter for the glitch (horizontal slip + flicker)
  const jitterX = frozen ? (random(`x${frame}`) - 0.5) * 24 : 0;
  const flicker = frozen ? 0.85 + random(`f${frame}`) * 0.15 : 1;

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translateX(${jitterX}px)`,
    filter: frozen ? `contrast(1.15) saturate(0.65) brightness(${flicker})` : "none",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {frozen ? (
        <Freeze frame={freezePoint}>
          <OffthreadVideo src={src} muted={muted} style={videoStyle} />
        </Freeze>
      ) : (
        <OffthreadVideo src={src} muted={muted} style={videoStyle} />
      )}

      {frozen ? (
        <>
          {/* scanlines */}
          <AbsoluteFill
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)",
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
          {/* RGB-shift color bars flashing */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(100deg, rgba(229,62,82,0.10), rgba(137,183,232,0.10) 50%, rgba(242,169,60,0.10))",
              opacity: random(`rgb${Math.floor(frame / 2)}`) > 0.5 ? 0.9 : 0.3,
              mixBlendMode: "screen",
            }}
          />
          {/* SFX */}
          <Sequence from={freezePoint}>
            <Audio src={staticFile("audio/sfx/tv_stuck.wav")} volume={0.9} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
