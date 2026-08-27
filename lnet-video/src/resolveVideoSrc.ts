import { staticFile } from "remotion";

/**
 * Accepts either a file name that lives in `public/` ("video.mp4")
 * or a full URL to a video, and returns something <OffthreadVideo /> can play.
 */
export const resolveVideoSrc = (videoSrc: string) => {
  if (/^(https?:|blob:|data:)/.test(videoSrc)) {
    return videoSrc;
  }

  return staticFile(videoSrc);
};
