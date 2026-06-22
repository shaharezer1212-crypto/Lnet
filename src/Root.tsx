import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import {
  clips,
  FPS,
  WIDTH,
  HEIGHT,
  TRANSITION_SECONDS,
} from "./clips";

// Total frames = sum of clip durations minus the overlap eaten by each
// cross-fade transition between consecutive clips.
const totalClipFrames = clips.reduce(
  (sum, c) => sum + Math.round(c.durationSeconds * FPS),
  0
);
const transitionCount = Math.max(0, clips.length - 1);
const transitionFrames = Math.round(TRANSITION_SECONDS * FPS);
const durationInFrames = Math.max(
  1,
  totalClipFrames - transitionCount * transitionFrames
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
