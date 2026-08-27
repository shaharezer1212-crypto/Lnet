import React, { useState } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveVideoSrc as resolveSrc } from "./resolveVideoSrc";
import { SceneTitle } from "./SceneTitle";
import type { TitleCardProps } from "./schema";

/** Stands in for the artwork so the animation stays reviewable without it. */
const FallbackBackground: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #3f9ad8 0%, #9fd8f2 52%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "52%",
        height: "16%",
        background: "linear-gradient(180deg, #1f8fb8 0%, #3bb3cf 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "68%",
        bottom: 0,
        background: "linear-gradient(180deg, #ecd6a8 0%, #d6b378 100%)",
      }}
    />
  </AbsoluteFill>
);

export const Outro: React.FC<TitleCardProps> = ({
  imageSrc,
  durationInSeconds,
  ...titleProps
}) => {
  const [backgroundFailed, setBackgroundFailed] = useState(false);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A slow push in, so a still frame still feels like a shot.
  const scale = interpolate(frame, [0, durationInSeconds * fps], [1, 1.055], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {backgroundFailed ? (
          <FallbackBackground />
        ) : (
          <Img
            src={resolveSrc(imageSrc)}
            onError={() => setBackgroundFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </AbsoluteFill>

      <SceneTitle {...titleProps} />
    </AbsoluteFill>
  );
};
