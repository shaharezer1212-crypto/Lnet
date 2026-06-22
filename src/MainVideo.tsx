import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  clips,
  narration,
  music,
  duckRanges,
  totalFrames,
  TRANSITION_SECONDS,
  type Clip,
} from "./clips";

const ClipContent: React.FC<{ clip: Clip }> = ({ clip }) => {
  if (clip.src) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          // Keep audio only for clips that carry their own narration.
          muted={!clip.hasOwnAudio}
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

  // Duck the global narration to silence while a baked-in-narration clip plays.
  const narrationVolume = (frame: number): number => {
    const inDuck = duckRanges.some(([s, e]) => frame >= s && frame < e);
    return inDuck ? 0 : (narration?.volume ?? 1);
  };

  // Background music: fade in at the start, fade out at the end, low baseline.
  const musicBaseline = music?.volume ?? 0.18;
  const musicFade = Math.round((music?.fadeSeconds ?? 1.5) * fps);
  const musicVolume = (frame: number): number =>
    interpolate(
      frame,
      [0, musicFade, totalFrames - musicFade, totalFrames],
      [0, musicBaseline, musicBaseline, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

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
        <Audio src={staticFile(narration.src)} volume={narrationVolume} />
      ) : null}
      {music ? (
        <Audio src={staticFile(music.src)} volume={musicVolume} />
      ) : null}
    </AbsoluteFill>
  );
};
