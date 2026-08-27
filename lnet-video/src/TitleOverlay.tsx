import { loadFont } from "@remotion/google-fonts/Heebo";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TitledVideoProps } from "./schema";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "800"],
  subsets: ["hebrew", "latin"],
});

const HEBREW_OR_ARABIC = /[֐-׿؀-ۿ]/;

const resolveDirection = (
  direction: TitledVideoProps["direction"],
  text: string,
): "rtl" | "ltr" => {
  if (direction !== "auto") {
    return direction;
  }

  return HEBREW_OR_ARABIC.test(text) ? "rtl" : "ltr";
};

type Props = Omit<TitledVideoProps, "videoSrc">;

export const TitleOverlay: React.FC<Props> = ({
  title,
  subtitle,
  position,
  direction,
  fontSize,
  textColor,
  accentColor,
  backdropOpacity,
  appearAtInSeconds,
  visibleForInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps, height, durationInFrames } = useVideoConfig();

  const appearAt = Math.round(appearAtInSeconds * fps);
  const visibleFor =
    visibleForInSeconds > 0
      ? Math.round(visibleForInSeconds * fps)
      : durationInFrames - appearAt;
  const disappearAt = Math.min(appearAt + visibleFor, durationInFrames);

  const enter = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.8),
  });
  const exit = interpolate(
    frame,
    [disappearAt - Math.round(fps * 0.5), disappearAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = enter * exit;

  if (opacity === 0) {
    return null;
  }

  // Everything is authored for 1080p and scaled to the real video size,
  // so the title looks identical on a 720p or a 4K source.
  const scale = height / 1080;
  const resolved = resolveDirection(direction, `${title} ${subtitle}`);

  return (
    <AbsoluteFill
      style={{
        direction: resolved,
        justifyContent:
          position === "top"
            ? "flex-start"
            : position === "center"
              ? "center"
              : "flex-end",
        alignItems: "stretch",
        padding: 80 * scale,
        opacity,
        transform: `translateY(${interpolate(enter, [0, 1], [40 * scale, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 24 * scale,
          alignSelf: "flex-start",
          maxWidth: "85%",
          padding: backdropOpacity > 0 ? 32 * scale : 0,
          borderRadius: 16 * scale,
          backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
          backdropFilter: backdropOpacity > 0 ? `blur(${8 * scale}px)` : "none",
        }}
      >
        <div
          style={{
            width: 8 * scale,
            borderRadius: 8 * scale,
            backgroundColor: accentColor,
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: fontSize * scale,
              lineHeight: 1.15,
              color: textColor,
              textShadow:
                backdropOpacity > 0
                  ? "none"
                  : `0 ${4 * scale}px ${16 * scale}px rgba(0, 0, 0, 0.6)`,
            }}
          >
            {title}
          </div>
          {subtitle === "" ? null : (
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: fontSize * 0.5 * scale,
                lineHeight: 1.3,
                marginTop: 12 * scale,
                color: textColor,
                opacity: 0.85,
                textShadow:
                  backdropOpacity > 0
                    ? "none"
                    : `0 ${3 * scale}px ${12 * scale}px rgba(0, 0, 0, 0.6)`,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
