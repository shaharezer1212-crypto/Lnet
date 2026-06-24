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

// Closing card: Tadhar logo + "ברוכים הבאים ובהצלחה" on the brand green.
export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const logoScale = interpolate(logoIn, [0, 1], [0.86, 1]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const subIn = spring({ frame: frame - 22, fps, config: { damping: 200 }, durationInFrames: 28 });
  const subY = interpolate(subIn, [0, 1], [34, 0]);
  const subOpacity = interpolate(frame - 22, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.green, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
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
          <Img src={staticFile("logo/tadhar_logo.png")} style={{ width: 520, height: "auto", display: "block" }} />
        </div>
        <div style={{ display: "flex", gap: 6, height: 8 }}>
          {ACCENTS.map((c, i) => (
            <div key={i} style={{ width: 50, height: 8, background: c, borderRadius: 4, opacity: logoOpacity }} />
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 58,
            fontWeight: 800,
            color: BRAND.white,
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
            direction: "rtl",
          }}
        >
          ברוכים הבאים, ובהצלחה
        </div>
      </div>
    </AbsoluteFill>
  );
};
