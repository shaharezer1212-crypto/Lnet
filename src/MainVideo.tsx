import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { segments, OPENING_SECONDS, TRANSITION_SECONDS } from "./edit";
import { Opening } from "./Opening";
import { Title } from "./Title";

export const MainVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const transitionFrames = Math.round(TRANSITION_SECONDS * fps);
  const openingFrames = Math.round(OPENING_SECONDS * fps);

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
                  <OffthreadVideo
                    src={staticFile(seg.clip)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {seg.title ? (
                    <Title data={seg.title} sceneDurationFrames={dur} />
                  ) : null}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              {i < segments.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
