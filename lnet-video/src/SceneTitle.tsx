import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { gazozFontStack } from "./gazoz";
import { resolveVideoSrc as resolveSrc } from "./resolveVideoSrc";
import type { Anchor, TitleCardProps } from "./schema";

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

/** Frames at which each part of the title starts moving. */
const TITLE_START = 6;
const WORD_STAGGER = 3;
const SUBTITLE_START = 30;
const SIGNATURE_START = 46;
const LOGO_START = 54;

type Props = Omit<TitleCardProps, "imageSrc" | "durationInSeconds">;

export const SceneTitle: React.FC<Props> = ({
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
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

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

  /** A springy pop, used for every element that enters. */
  const pop = (startAt: number) =>
    spring({
      frame: frame - startAt,
      fps,
      config: { damping: 11, mass: 0.7, stiffness: 130 },
    });

  /** A calmer fade-and-rise, for the lines that follow the title. */
  const rise = (startAt: number) => {
    const progress = spring({
      frame: frame - startAt,
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(fps * 0.7),
    });

    return {
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [px(28), 0])}px)`,
    };
  };

  const words = title.split(" ");
  const align = horizontalAlign(anchor);

  return (
    <>
      <AbsoluteFill
        style={{
          direction: "rtl",
          justifyContent: verticalAlign(anchor),
          alignItems: align,
          padding: `${px(56)}px ${px(72)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: align,
            textAlign: anchor.endsWith("left")
              ? "left"
              : anchor.endsWith("right")
                ? "right"
                : "center",
          }}
        >
          {/* The words land one after another, right to left. */}
          <div
            style={{
              ...inScene(titleFontSize),
              color: textColor,
              lineHeight: 1.02,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: align,
              columnGap: px(titleFontSize * 0.26),
            }}
          >
            {words.map((word, index) => {
              const entrance = pop(TITLE_START + index * WORD_STAGGER);

              return (
                <span
                  key={`${word}-${index}`}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, entrance * 1.6),
                    transform: `translateY(${interpolate(entrance, [0, 1], [px(70), 0])}px) scale(${interpolate(entrance, [0, 1], [0.72, 1])})`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {subtitle === "" ? null : (
            <div
              style={{
                ...inScene(titleFontSize * 0.58),
                ...rise(SUBTITLE_START),
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
                ...rise(SIGNATURE_START),
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

      {logoSrc === "" ? null : (
        <AbsoluteFill
          style={{
            justifyContent: verticalAlign(logoAnchor),
            alignItems: horizontalAlign(logoAnchor),
            padding: `${px(44)}px ${px(56)}px`,
          }}
        >
          <Img
            src={resolveSrc(logoSrc)}
            style={{
              height: logoHeightRatio * height,
              width: "auto",
              objectFit: "contain",
              opacity: Math.min(1, pop(LOGO_START) * 1.6),
              transform: `scale(${interpolate(pop(LOGO_START), [0, 1], [0.86, 1])})`,
              // A light halo first, so a dark logo separates from dark artwork,
              // then a soft shadow to seat it on the image.
              filter: `drop-shadow(0 0 ${px(10)}px rgba(255, 255, 255, 0.8)) drop-shadow(0 ${px(6)}px ${px(14)}px rgba(0, 0, 0, ${shadowStrength * 0.6}))`,
            }}
          />
        </AbsoluteFill>
      )}
    </>
  );
};
