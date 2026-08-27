import React, { useState } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { resolveVideoSrc } from "./resolveVideoSrc";
import { TitleOverlay } from "./TitleOverlay";
import type { TitledVideoProps } from "./schema";

const MissingVideo: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b1120",
        color: "#94a3b8",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 60,
        fontFamily: "sans-serif",
        fontSize: 28,
        lineHeight: 1.6,
      }}
    >
      <div>
        Could not load <code>{videoSrc}</code>.
        <br />
        Drop your video into the <code>public/</code> folder and set{" "}
        <code>videoSrc</code> to its file name.
      </div>
    </AbsoluteFill>
  );
};

export const TitledVideo: React.FC<TitledVideoProps> = ({
  videoSrc,
  ...titleProps
}) => {
  const [failed, setFailed] = useState(false);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {failed ? (
        <MissingVideo videoSrc={videoSrc} />
      ) : (
        <OffthreadVideo
          src={resolveVideoSrc(videoSrc)}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <TitleOverlay {...titleProps} />
    </AbsoluteFill>
  );
};
