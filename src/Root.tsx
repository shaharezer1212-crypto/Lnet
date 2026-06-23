import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { MainVideo } from "./MainVideo";
import { Opening } from "./Opening";
import { FPS, WIDTH, HEIGHT, totalFrames } from "./clips";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Opening"
        component={Opening}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
