import React, { useState } from "react";
import { AbsoluteFill, Img, useVideoConfig } from "remotion";
import { gazozFontStack } from "./gazoz";
import { resolveVideoSrc as resolveSrc } from "./resolveVideoSrc";
import type { TitleCardProps } from "./schema";

/** Shown while there is no background image yet, so the layout stays reviewable. */
const FallbackBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, #7dd3fc 0%, #bae6fd 45%, #fde3b0 70%, #e7c489 100%)",
    }}
  />
);

const withAlpha = (color: string, alpha: number) => {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) {
    return color;
  }

  const value = parseInt(match[1], 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  signature,
  layout,
  bandHeightRatio,
  bandOpacity,
  bandColor,
  accentColor,
  textColor,
  titleFontSize,
  logoHeightRatio,
}) => {
  const [backgroundFailed, setBackgroundFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const { height } = useVideoConfig();
  const atBottom = layout === "bottom";
  const solidRatio = bandHeightRatio * 0.8;
  // Sizes are authored against a 1080px-tall image and scaled from there,
  // so the card looks the same whatever the source resolution is.
  const px = (value: number) => value * (height / 1080);

  return (
    <AbsoluteFill style={{ backgroundColor: bandColor }}>
      {backgroundFailed ? (
        <FallbackBackground />
      ) : (
        <Img
          src={resolveSrc(imageSrc)}
          onError={() => setBackgroundFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* A solid area the text can sit on, feathered into the image above it.
          These are plain divs on purpose: AbsoluteFill forces `height: 100%`,
          which would override `bottom` and stretch them past the frame. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [atBottom ? "top" : "bottom"]: `${(1 - solidRatio) * 100}%`,
          [atBottom ? "bottom" : "top"]: 0,
          backgroundColor: withAlpha(bandColor, bandOpacity),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [atBottom ? "top" : "bottom"]: `${(1 - bandHeightRatio) * 100}%`,
          [atBottom ? "bottom" : "top"]: `${solidRatio * 100}%`,
          background: `linear-gradient(to ${atBottom ? "top" : "bottom"}, ${withAlpha(bandColor, bandOpacity)} 0%, ${withAlpha(bandColor, 0)} 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          direction: "rtl",
          justifyContent: atBottom ? "flex-end" : "flex-start",
          padding: atBottom
            ? `0 ${px(90)}px ${px(60)}px`
            : `${px(56)}px ${px(90)}px 0`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: px(60),
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: gazozFontStack,
                fontSize: px(titleFontSize),
                lineHeight: 1.05,
                color: textColor,
                textShadow: `0 ${px(4)}px ${px(24)}px rgba(0, 0, 0, 0.45)`,
              }}
            >
              {title}
            </div>
            {subtitle === "" ? null : (
              <div
                style={{
                  fontFamily: gazozFontStack,
                  fontSize: px(titleFontSize * 0.62),
                  lineHeight: 1.15,
                  marginTop: px(10),
                  color: accentColor,
                  textShadow: `0 ${px(3)}px ${px(18)}px rgba(0, 0, 0, 0.45)`,
                }}
              >
                {subtitle}
              </div>
            )}
            <div
              style={{
                width: px(titleFontSize * 1.4),
                height: px(6),
                borderRadius: px(6),
                backgroundColor: accentColor,
                margin: `${px(26)}px 0 ${px(20)}px`,
              }}
            />
            <div
              style={{
                fontFamily: gazozFontStack,
                fontSize: px(titleFontSize * 0.42),
                color: textColor,
                opacity: 0.9,
              }}
            >
              {signature}
            </div>
          </div>

          {logoSrc === "" || logoFailed ? null : (
            <Img
              src={resolveSrc(logoSrc)}
              onError={() => setLogoFailed(true)}
              style={{
                height: logoHeightRatio * height,
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
