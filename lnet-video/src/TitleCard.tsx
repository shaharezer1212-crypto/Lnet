import React, { useState } from "react";
import { AbsoluteFill, Img, useVideoConfig } from "remotion";
import { gazozFontStack } from "./gazoz";
import { resolveVideoSrc as resolveSrc } from "./resolveVideoSrc";
import type { Anchor, TitleCardProps } from "./schema";

/** Stands in for the artwork so the layout stays reviewable without it. */
const FallbackBackground: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #3f9ad8 0%, #9fd8f2 52%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "52%",
        height: "16%",
        background: "linear-gradient(180deg, #1f8fb8 0%, #3bb3cf 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "68%",
        bottom: 0,
        background: "linear-gradient(180deg, #ecd6a8 0%, #d6b378 100%)",
      }}
    />
  </AbsoluteFill>
);

const verticalAlign = (anchor: Anchor) => {
  if (anchor.startsWith("top")) {
    return "flex-start";
  }

  return anchor.startsWith("bottom") ? "flex-end" : "center";
};

const horizontalAlign = (anchor: Anchor) => {
  if (anchor.endsWith("right")) {
    return "flex-end";
  }

  return anchor.endsWith("left") ? "flex-start" : "center";
};

export const TitleCard: React.FC<TitleCardProps> = ({
  imageSrc,
  logoSrc,
  title,
  subtitle,
  signature,
  anchor,
  logoAnchor,
  textColor,
  accentColor,
  outlineColor,
  outlineWidth,
  shadowStrength,
  titleFontSize,
  logoHeightRatio,
}) => {
  const [backgroundFailed, setBackgroundFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { height } = useVideoConfig();

  // Sizes are authored against a 1080px-tall image and scaled from there,
  // so the title looks the same whatever the source resolution is.
  const px = (value: number) => value * (height / 1080);

  // `paint-order` keeps the stroke behind the glyph, so the outline grows
  // outwards instead of eating into the letterforms.
  const inScene = (fontSize: number) => ({
    fontFamily: gazozFontStack,
    fontSize: px(fontSize),
    WebkitTextStrokeWidth: px(outlineWidth * (fontSize / titleFontSize)),
    WebkitTextStrokeColor: outlineColor,
    paintOrder: "stroke fill" as const,
    textShadow: `0 ${px(fontSize * 0.06)}px ${px(fontSize * 0.16)}px rgba(0, 0, 0, ${shadowStrength})`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: outlineColor }}>
      {backgroundFailed ? (
        <FallbackBackground />
      ) : (
        <Img
          src={resolveSrc(imageSrc)}
          onError={() => setBackgroundFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      <AbsoluteFill
        style={{
          direction: "rtl",
          justifyContent: verticalAlign(anchor),
          alignItems: horizontalAlign(anchor),
          padding: `${px(56)}px ${px(72)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: horizontalAlign(anchor),
            textAlign: anchor.endsWith("left")
              ? "left"
              : anchor.endsWith("right")
                ? "right"
                : "center",
          }}
        >
          <div
            style={{
              ...inScene(titleFontSize),
              color: textColor,
              lineHeight: 1.02,
            }}
          >
            {title}
          </div>
          {subtitle === "" ? null : (
            <div
              style={{
                ...inScene(titleFontSize * 0.58),
                color: accentColor,
                lineHeight: 1.15,
                marginTop: px(12),
              }}
            >
              {subtitle}
            </div>
          )}
          {signature === "" ? null : (
            <div
              style={{
                ...inScene(titleFontSize * 0.36),
                color: textColor,
                lineHeight: 1.2,
                marginTop: px(20),
              }}
            >
              {signature}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {logoSrc === "" || logoFailed ? null : (
        <AbsoluteFill
          style={{
            justifyContent: verticalAlign(logoAnchor),
            alignItems: horizontalAlign(logoAnchor),
            padding: `${px(44)}px ${px(56)}px`,
          }}
        >
          <Img
            src={resolveSrc(logoSrc)}
            onError={() => setLogoFailed(true)}
            style={{
              height: logoHeightRatio * height,
              width: "auto",
              objectFit: "contain",
              filter: `drop-shadow(0 ${px(6)}px ${px(14)}px rgba(0, 0, 0, ${shadowStrength}))`,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
