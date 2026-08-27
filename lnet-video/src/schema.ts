import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const titledVideoSchema = z.object({
  /**
   * Either a file name inside `public/` (e.g. "video.mp4")
   * or a full URL to a video.
   */
  videoSrc: z.string(),
  title: z.string(),
  subtitle: z.string(),
  /** Where the title sits on top of the video. */
  position: z.enum(["top", "center", "bottom"]),
  /** "auto" picks RTL when the title contains Hebrew or Arabic letters. */
  direction: z.enum(["auto", "rtl", "ltr"]),
  /** Font size for a 1080p video. Smaller videos scale down automatically. */
  fontSize: z.number().min(8).max(300).step(1),
  textColor: zColor(),
  accentColor: zColor(),
  /** Dark panel behind the text. 0 = no panel, 1 = fully opaque. */
  backdropOpacity: z.number().min(0).max(1).step(0.05),
  /** Second at which the title starts animating in. */
  appearAtInSeconds: z.number().min(0).step(0.1),
  /** How long the title stays on screen. 0 = until the end of the video. */
  visibleForInSeconds: z.number().min(0).step(0.1),
});

export type TitledVideoProps = z.infer<typeof titledVideoSchema>;

export const titleCardSchema = z.object({
  /** File name inside `public/` (e.g. "beach.png") or a full URL. */
  imageSrc: z.string(),
  /** Logo file inside `public/`. Leave empty to hide the logo. */
  logoSrc: z.string(),
  title: z.string(),
  subtitle: z.string(),
  /** The sign-off line, e.g. the team name. */
  signature: z.string(),
  /** Which edge the text band sits on. */
  layout: z.enum(["bottom", "top"]),
  /** How much of the image the band's shading covers, from that edge. */
  bandHeightRatio: z.number().min(0.15).max(0.7).step(0.01),
  /** How opaque the band is over the image. */
  bandOpacity: z.number().min(0).max(1).step(0.02),
  /** Colour of the band the text sits on. */
  bandColor: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  /** Title size for a 1080p-tall image. Other sizes scale automatically. */
  titleFontSize: z.number().min(20).max(300).step(2),
  /** Height of the logo, as a share of the image height. */
  logoHeightRatio: z.number().min(0.02).max(0.4).step(0.01),
});

export type TitleCardProps = z.infer<typeof titleCardSchema>;
