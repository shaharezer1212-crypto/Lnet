import { parseMedia } from "@remotion/media-parser";
import { CalculateMetadataFunction, Composition } from "remotion";
import "./index.css";
import { getImageDimensions } from "./imageDimensions";
import { resolveVideoSrc } from "./resolveVideoSrc";
import { Outro } from "./Outro";
import { TitleCard } from "./TitleCard";
import { TitledVideo } from "./TitledVideo";
import {
  titleCardSchema,
  titledVideoSchema,
  type TitleCardProps,
  type TitledVideoProps,
} from "./schema";

// Used until the real video is readable, so the Studio still opens
// when `public/video.mp4` is missing.
const FALLBACK_FPS = 30;
const FALLBACK_WIDTH = 1920;
const FALLBACK_HEIGHT = 1080;
const FALLBACK_DURATION_IN_FRAMES = 150;

// h264 cannot encode odd dimensions.
const makeEven = (value: number) => Math.round(value / 2) * 2;

/**
 * Matches the composition to the video that was dropped in: its size,
 * frame rate and length are read from the file itself.
 */
const calculateMetadata: CalculateMetadataFunction<TitledVideoProps> = async ({
  props,
}) => {
  try {
    const { durationInSeconds, dimensions, fps } = await parseMedia({
      src: resolveVideoSrc(props.videoSrc),
      fields: { durationInSeconds: true, dimensions: true, fps: true },
      acknowledgeRemotionLicense: true,
    });

    const frameRate = fps ?? FALLBACK_FPS;

    return {
      fps: frameRate,
      width: dimensions ? makeEven(dimensions.width) : FALLBACK_WIDTH,
      height: dimensions ? makeEven(dimensions.height) : FALLBACK_HEIGHT,
      durationInFrames: durationInSeconds
        ? Math.max(1, Math.round(durationInSeconds * frameRate))
        : FALLBACK_DURATION_IN_FRAMES,
    };
  } catch {
    return {};
  }
};

/** Sizes the card to the image it is drawn on. */
const calculateCardMetadata: CalculateMetadataFunction<
  TitleCardProps
> = async ({ props }) => {
  const durationInFrames = Math.round(props.durationInSeconds * FALLBACK_FPS);

  try {
    const { width, height } = await getImageDimensions(
      resolveVideoSrc(props.imageSrc),
    );

    return {
      width: makeEven(width),
      height: makeEven(height),
      durationInFrames,
    };
  } catch {
    return { durationInFrames };
  }
};

const titleCardDefaults = {
  imageSrc: "beach.png",
  logoSrc: "logo.png",
  title: "פתיחת שנת לימודים מוצלחת",
  subtitle: "מלאה בחוויות טובות וחדשנות",
  signature: "צוות כלים שלובים",
  anchor: "top-center" as const,
  logoAnchor: "bottom-left" as const,
  textColor: "#ffffff",
  accentColor: "#ffd66b",
  outlineColor: "#0d3552",
  outlineWidth: 9,
  shadowStrength: 0.5,
  titleFontSize: 108,
  logoHeightRatio: 0.13,
  durationInSeconds: 6,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TitledVideo"
        component={TitledVideo}
        schema={titledVideoSchema}
        calculateMetadata={calculateMetadata}
        fps={FALLBACK_FPS}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        durationInFrames={FALLBACK_DURATION_IN_FRAMES}
        defaultProps={{
          videoSrc: "sample.mp4",
          title: "הכותרת שלי",
          subtitle: "",
          position: "bottom" as const,
          direction: "auto" as const,
          fontSize: 84,
          textColor: "#ffffff",
          accentColor: "#38bdf8",
          backdropOpacity: 0.45,
          appearAtInSeconds: 0.3,
          visibleForInSeconds: 0,
        }}
      />
      <Composition
        id="Outro"
        component={Outro}
        schema={titleCardSchema}
        calculateMetadata={calculateCardMetadata}
        fps={FALLBACK_FPS}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        durationInFrames={FALLBACK_DURATION_IN_FRAMES}
        defaultProps={titleCardDefaults}
      />
      <Composition
        id="TitleCard"
        component={TitleCard}
        schema={titleCardSchema}
        calculateMetadata={calculateCardMetadata}
        fps={FALLBACK_FPS}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        durationInFrames={FALLBACK_DURATION_IN_FRAMES}
        defaultProps={titleCardDefaults}
      />
    </>
  );
};
