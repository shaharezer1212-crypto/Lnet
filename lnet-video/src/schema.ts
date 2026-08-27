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
