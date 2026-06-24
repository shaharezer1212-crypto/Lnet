import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { MainVideo } from "./MainVideo";
import { Opening } from "./Opening";
import {
  FPS,
  WIDTH,
  HEIGHT,
  segments,
  OPENING_SECONDS,
  CLOSING_SECONDS,
  TRANSITION_SECONDS,
} from "./edit";

const transitionFrames = Math.round(TRANSITION_SECONDS * FPS);
const openingFrames = Math.round(OPENING_SECONDS * FPS);
const closingFrames = Math.round(CLOSING_SECONDS * FPS);
const segmentFrames = segments.reduce(
  (s, seg) => s + Math.round(seg.durationSeconds * FPS),
  0
);
// opening + N segments + closing = (N+2) sequences => (N+1) transitions,
// minus one for every freeze segment (hard cut, no cross-fade after it)
const numFreeze = segments.filter((s) => s.freeze).length;
const numTransitions = segments.length + 1 - numFreeze;
const totalFrames = Math.max(
  1,
  openingFrames + segmentFrames + closingFrames - numTransitions * transitionFrames
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Opening"
        component={Opening}
        durationInFrames={openingFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
