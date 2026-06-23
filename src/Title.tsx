import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "./brand";
import { FONT_FAMILY } from "./fonts";
import type { Title as TitleData } from "./edit";

// Kinetic lower-third title. Slides up bottom-right (RTL), an accent bar wipes
// in, then it exits. If `rotate` is set, the lines cycle one at a time.
export const Title: React.FC<{ data: TitleData; sceneDurationFrames: number }> = ({
  data,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = data.accent ?? BRAND.red;

  // appear shortly after the cut, leave before the scene ends
  const inAt = 10;
  const outAt = sceneDurationFrames - 16;

  const enter = spring({ frame: frame - inAt, fps, config: { damping: 200 }, durationInFrames: 24 });
  const exit = interpolate(frame, [outAt, outAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const appear = enter * (1 - exit);

  const y = interpolate(appear, [0, 1], [60, 0]);
  const barScale = interpolate(
    spring({ frame: frame - inAt - 4, fps, config: { damping: 200 }, durationInFrames: 22 }),
    [0, 1],
    [0, 1]
  );

  // rotation of lines (for "מענה מהיר / פתרון בעיות / קור רוח")
  let lines = data.lines;
  if (data.rotate && data.lines.length > 1) {
    const span = outAt - inAt;
    const per = span / data.lines.length;
    const idx = Math.min(
      data.lines.length - 1,
      Math.max(0, Math.floor((frame - inAt) / per))
    );
    lines = [data.lines[idx]];
  }

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 90 }}>
      <div
        style={{
          opacity: appear,
          transform: `translateY(${y}px)`,
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "stretch",
          gap: 0,
          direction: "rtl",
        }}
      >
        {/* accent bar */}
        <div
          style={{
            width: 12,
            background: accent,
            borderRadius: 6,
            transform: `scaleY(${barScale})`,
            transformOrigin: "bottom",
          }}
        />
        {/* text plate */}
        <div
          style={{
            background: "rgba(6,48,42,0.86)",
            backdropFilter: "blur(2px)",
            padding: "18px 30px",
            marginRight: 14,
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {lines.map((ln, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: lines.length > 1 ? 52 : 64,
                color: BRAND.white,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              {ln}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
