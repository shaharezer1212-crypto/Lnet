import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  clips,
  narration,
  music,
  TRANSITION_SECONDS,
  type Clip,
} from "./clips";

const ClipContent: React.FC<{ clip: Clip }> = ({ clip }) => {
  if (clip.src) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          startFrom={
            clip.startFromSeconds
              ? Math.round(clip.startFromSeconds * 30)
              : undefined
          }
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  // Placeholder card (no source file yet)
  return (
    <AbsoluteFill
      style={{
        backgroundColor: clip.color ?? "#111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 120,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: 4,
          opacity: 0.85,
        }}
      >
        {clip.label ?? "CLIP"}
      </div>
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const transitionFrames = Math.round(TRANSITION_SECONDS * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {clips.map((clip, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence
              durationInFrames={Math.round(clip.durationSeconds * fps)}
            >
              <ClipContent clip={clip} />
            </TransitionSeries.Sequence>
            {i < clips.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: transitionFrames })}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {narration ? (
        <Audio src={staticFile(narration.src)} volume={narration.volume ?? 1} />
      ) : null}
      {music ? (
        <Audio src={staticFile(music.src)} volume={music.volume ?? 0.2} />
      ) : null}
    </AbsoluteFill>
  );
};
