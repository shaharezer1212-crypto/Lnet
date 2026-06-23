import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, ACCENTS } from "./brand";
import { FONT_FAMILY } from "./fonts";

// Opening title card: Tadhar logo builds in, then the subtitle
// "תפקיד האחראי הלוגיסטי" rises underneath, on the brand green.
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo: scale + fade in with a spring
  const logoIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const logoScale = interpolate(logoIn, [0, 1], [0.82, 1]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // Accent bar wipes in under the logo
  const barW = interpolate(
    spring({ frame: frame - 14, fps, config: { damping: 200 }, durationInFrames: 28 }),
    [0, 1],
    [0, 1]
  );

  // Subtitle rises + fades in
  const subIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 30 });
  const subY = interpolate(subIn, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame - 26, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gentle exit fade at the very end
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.green, justifyContent: "center", alignItems: "center", opacity: exit }}>
      {/* subtle building-block accents in the corners */}
      <CornerBlocks frame={frame} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div
          style={{
            background: BRAND.white,
            padding: "34px 54px",
            borderRadius: 18,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}
        >
          <Img src={staticFile("logo/tadhar_logo.png")} style={{ width: 540, height: "auto", display: "block" }} />
        </div>

        {/* accent underline */}
        <div style={{ display: "flex", gap: 6, height: 8, marginTop: 4 }}>
          {ACCENTS.map((c, i) => (
            <div
              key={i}
              style={{
                width: 54 * Math.min(1, Math.max(0, barW * ACCENTS.length - i)),
                height: 8,
                background: c,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 800,
            color: BRAND.white,
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
            direction: "rtl",
            letterSpacing: 1,
          }}
        >
          תפקיד האחראי הלוגיסטי
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CornerBlocks: React.FC<{ frame: number }> = ({ frame }) => {
  const o = interpolate(frame, [6, 30], [0, 0.16], { extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, background: BRAND.leaf, opacity: o, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, background: BRAND.blue, opacity: o, transform: "rotate(45deg)" }} />
    </>
  );
};
