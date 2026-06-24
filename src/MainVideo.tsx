import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  segments,
  OPENING_SECONDS,
  CLOSING_SECONDS,
  TRANSITION_SECONDS,
  MUTE_CLIPS,
  NARRATION,
} from "./edit";
import { Opening } from "./Opening";
import { Closing } from "./Closing";
import { Title } from "./Title";
import { FreezeScene } from "./FreezeScene";

export const MainVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const transitionFrames = Math.round(TRANSITION_SECONDS * fps);
  const openingFrames = Math.round(OPENING_SECONDS * fps);

  // Scene 1 begins right after the opening card (the transition overlaps it).
  const narrationStart = Math.max(0, openingFrames - transitionFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {/* Opening title card */}
        <TransitionSeries.Sequence durationInFrames={openingFrames}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionFrames })}
        />

        {segments.map((seg, i) => {
          const dur = Math.round(seg.durationSeconds * fps);
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={dur}>
                <AbsoluteFill style={{ backgroundColor: "black" }}>
                  {seg.freeze ? (
                    <FreezeScene
                      src={staticFile(seg.clip)}
                      durationInFrames={dur}
                      muted={MUTE_CLIPS}
                    />
                  ) : (
                    <OffthreadVideo
                      src={staticFile(seg.clip)}
                      muted={MUTE_CLIPS}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  {seg.title ? (
                    <Title data={seg.title} sceneDurationFrames={dur} />
                  ) : null}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              {/* hard cut right after the freeze ("TV unsticks"); else cross-fade */}
              {seg.freeze ? null : (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Closing logo card */}
        <TransitionSeries.Sequence durationInFrames={Math.round(CLOSING_SECONDS * fps)}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Master narration — the single continuous voice track */}
      <Sequence from={narrationStart}>
        <Audio src={staticFile(NARRATION)} />
      </Sequence>
    </AbsoluteFill>
  );
};
