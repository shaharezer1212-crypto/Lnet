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
  // Set true for a clip that has its OWN narration/voice baked into it.
  // Its audio is kept, and the global narration track is ducked (silenced)
  // for the duration of this clip so the two voices never collide.
  hasOwnAudio?: boolean;
};

// The narration that plays across the whole edit. Set to null if none yet.
export const narration: { src: string; volume?: number } | null = null;
// Example once you have it:
// export const narration = { src: "audio/voiceover.mp3", volume: 1 };

// Background music under everything. Plays low, fades in/out automatically.
export const music: {
  src: string;
  volume?: number; // baseline level under narration (default 0.18)
  fadeSeconds?: number; // fade in/out length (default 1.5)
} | null = null;

// The edit timeline, top-to-bottom = first-to-last.
export const clips: Clip[] = [
  { color: "#0B1F3A", label: "CLIP 1", durationSeconds: 5 },
  { color: "#13315C", label: "CLIP 2", durationSeconds: 5 },
  { color: "#1B4965", label: "CLIP 3", durationSeconds: 5 },
];

// ── Derived timeline math (used for total duration + ducking) ───────────────
// In a TransitionSeries each cross-fade overlaps the two clips it joins, so the
// absolute timeline is shorter than the naive sum of clip durations.
const transFrames = Math.round(TRANSITION_SECONDS * FPS);

export const clipFrames = clips.map((c) =>
  Math.round(c.durationSeconds * FPS)
);

// Absolute start frame of each clip on the final timeline.
export const clipStarts: number[] = (() => {
  const starts: number[] = [];
  let cursor = 0;
  for (let i = 0; i < clips.length; i++) {
    starts.push(cursor);
    // advance by this clip, then pull back by the transition it shares with next
    cursor += clipFrames[i];
    if (i < clips.length - 1) cursor -= transFrames;
  }
  return starts;
})();

export const totalFrames = Math.max(
  1,
  clipStarts[clips.length - 1] + clipFrames[clips.length - 1]
);

// Frame ranges where a clip carries its own baked-in narration — the global
// narration track is ducked to silence across these ranges.
export const duckRanges: Array<[number, number]> = clips
  .map((c, i) =>
    c.hasOwnAudio
      ? ([clipStarts[i], clipStarts[i] + clipFrames[i]] as [number, number])
      : null
  )
  .filter((r): r is [number, number] => r !== null);
