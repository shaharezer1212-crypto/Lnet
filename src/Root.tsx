import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FPS, WIDTH, HEIGHT, totalFrames } from "./clips";

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
    </>
  );
};
