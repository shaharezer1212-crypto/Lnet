// ────────────────────────────────────────────────────────────────────────────
//  EDIT CONFIG — this is the only file you normally touch to assemble the video.
//
//  1. Drop your video clips into:   public/clips/
//  2. Drop your narration audio in: public/audio/
//  3. List the clips below in order, with how long each should play (seconds).
//
//  Until you add real files, the placeholder clips below let the studio run.
// ────────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Default cross-fade length between clips, in seconds.
export const TRANSITION_SECONDS = 0.6;

export type Clip = {
  // Path under /public, e.g. "clips/intro.mp4".
  // Leave undefined to render a colored placeholder card (uses `color` + `label`).
  src?: string;
  // How long this clip stays on screen, in seconds.
  durationSeconds: number;
  // Placeholder-only: background color + caption shown when there is no `src`.
  color?: string;
  label?: string;
  // Optional: trim the source — start playing the clip from this second.
  startFromSeconds?: number;
};

// The narration that plays across the whole edit. Set to null if none yet.
export const narration: { src: string; volume?: number } | null = null;
// Example once you have it:
// export const narration = { src: "audio/voiceover.mp3", volume: 1 };

// Optional background music under the narration.
export const music: { src: string; volume?: number } | null = null;

// The edit timeline, top-to-bottom = first-to-last.
export const clips: Clip[] = [
  { color: "#0B1F3A", label: "CLIP 1", durationSeconds: 5 },
  { color: "#13315C", label: "CLIP 2", durationSeconds: 5 },
  { color: "#1B4965", label: "CLIP 3", durationSeconds: 5 },
];
