// ──────────────────────────────────────────────────────────────────────────
// KudoZ — final clip set (Higgsfield / Seedance 2.0, dynamic style).
import {staticFile} from 'remotion';

// ONE clip per beat. No duplicates, no abandoned "gentle" takes.
// Live-action clips stream from the Higgsfield CDN; motion-graphics beats are
// rendered natively in Remotion. Each beat may carry an Ashley (en) voice-over.
// ──────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Transition length between every segment (frames) — kept constant so the
// timeline math stays exact; the *style* of each cut varies in KudoZVideo.
export const TRANSITION = 16;

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC';

// Background music — bouncy modern urban groove with handclaps + snaps and
// 808 bass (option C), 120s so it covers the full extended edit.
export const MUSIC_URL = `${CDN}/hf_20260618_073734_ab535d97-c8a5-4a92-a397-b558551d91f3.m4a`;
// Music sits under the voice-over but stays present.
export const MUSIC_VOLUME = 0.15;
// Diegetic clip audio is ducked under the narration (per-clip override via beat.volume).
export const CLIP_VOLUME = 0.26;

// Single continuous narration (Ashley) — one take, no per-line overlap.
export const NARRATION_URL = `${CDN}/hf_20260617_130038_d1487192-cf5f-4e19-843e-ab21785fa213.wav`;
// Small lead-in so the voice doesn't start on the very first frame.
export const NARRATION_START = 8;
// Client-recorded narration — already well levelled, so play it at unity.
export const NARRATION_VOLUME = 1.0;

// ── Brand assets (fill when provided) ───────────────────────────────────────
// Official KudoZ wordmark (navy "Kudo" + gold "Z"), transparent PNG committed
// to the repo so the renderer can always load it; shown on the navy stage
// inside a soft glowing halo so it reads cleanly without any white box.
export const LOGO_URL = staticFile('logo.png');
// All-white KudoZ wordmark — used on the blue brand background in the logo
// moments (reads cleanly on the image without relying on a bright halo).
export const LOGO_WHITE_URL = staticFile('logo-white.png');
// B-roll of the work environment, shown in the system/values section.
// Empty → a labelled placeholder panel is shown instead.
export const FOOTAGE_URL = '';

// Real screenshot of the KudoZ store (committed to the repo), shown in a
// browser frame in the infographic section with an animated cursor click.
export const STORE_URL = staticFile('store.jpg');

// Infographic "screens showcase": the branded background + the nine system
// screenshots, shown in the video in order 9 → 1.
export const SCREENS_BG = staticFile('screens/VB-BG-1.jpg');
export const SCREENS: string[] = [9, 8, 7, 6, 5, 4, 3, 2, 1].map((nnn) =>
  staticFile(`screens/${nnn}screenshots.png`),
);

// Real KudoZ sticker artwork — background removed (transparent) — that
// floats/pops around the MG scenes. Stickers #1, #4 and #8 were dropped
// because their artwork was badly cropped; these five are the clean ones.
const OUT = 'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC';
export const STICKERS: string[] = [
  `${OUT}/hf_20260617_174953_fead458d-b018-4e73-9756-39f4c6172612.png`,
  `${OUT}/hf_20260617_174954_bcfe0fe2-e6b4-40b5-8970-ff07a5a83e46.png`,
  `${OUT}/hf_20260617_174957_31f3a8e5-5175-4b1b-875d-5a1aaf653bcc.png`,
  `${OUT}/hf_20260617_174958_889f0cd6-7170-4ea4-ab1f-834db29eae05.png`,
  `${OUT}/hf_20260617_175000_ec23dc44-d0c2-4725-9033-b4f2fbb541eb.png`,
];

export type Beat =
  | {
      kind: 'clip';
      id: string;
      label: string;
      seconds: number;
      jobId: string;
      url: string;
      vo?: string;
      narration?: string;
      // Per-clip diegetic audio volume override (defaults to CLIP_VOLUME).
      volume?: number;
      // Optional animated on-screen title (Magistral) overlaid on the clip.
      title?: string;
      // Where the title sits: 'bottom' (default) or 'left' (left-centre).
      titlePos?: 'bottom' | 'left';
      // Frame at which the title animates in (defaults to 8).
      titleStart?: number;
      // Number of trailing words rendered large + coloured (the hero phrase).
      titleEmphasis?: number;
      // Project the title onto the scene's wall in perspective (angled).
      titleAngled?: boolean;
      // Optional slow-motion: <1 plays the clip slower, stretching it to fill
      // a longer beat (e.g. a 15s take played over ~20s).
      playbackRate?: number;
      // Phased narration: staticFile path of the VO segment that STARTS here.
      narr?: string;
    }
  | {
      kind: 'mg';
      id: string;
      label: string;
      seconds: number;
      mg: 'intro' | 'logo' | 'store' | 'screens' | 'storescreens' | 'criteria' | 'outro' | 'white';
      vo?: string;
      narration?: string;
      // Phased narration: staticFile path of the VO segment that STARTS here.
      narr?: string;
    };

export const sec = (s: number) => Math.round(s * FPS);

export const TIMELINE: Beat[] = [
  // New edit — the client's fresh scenes (new cast). Music only, NO narration.
  // Live scenes 1-10 in order, with plain white placeholders where the graphics
  // used to be (middle = logo + screenshots slot, end = outro slot). All clips
  // are muted; only the background music plays.
  {kind: 'clip', id: 'sc1', label: 'Scene 1 · lounge two-shot', seconds: 5, volume: 0, jobId: 'client', url: staticFile('sc1.mp4')},
  {kind: 'clip', id: 'sc2', label: 'Scene 2 · man + notification', seconds: 15, volume: 0, jobId: 'client', url: staticFile('sc2.mp4')},
  {kind: 'clip', id: 'sc3', label: 'Scene 3 · coffee / kitchenette', seconds: 6, volume: 0, jobId: 'client', url: staticFile('sc3.mp4')},
  {kind: 'clip', id: 'sc4', label: 'Scene 4 · corridor (woman)', seconds: 6, volume: 0, jobId: 'client', url: staticFile('sc4.mp4')},
  {kind: 'clip', id: 'sc5', label: 'Scene 5 · desk / ZIMonitor', seconds: 6, volume: 0, jobId: 'client', url: staticFile('sc5.mp4')},
  {kind: 'clip', id: 'sc6', label: 'Scene 6 · office walk (woman)', seconds: 6, volume: 0, jobId: 'client', url: staticFile('sc6.mp4')},
  // ── White placeholder — the middle graphics slot (logo + screenshots) ──
  {kind: 'mg', id: 'mid-white', label: 'White placeholder · graphics slot', seconds: 32.5, mg: 'white'},
  {kind: 'clip', id: 'sc7', label: 'Scene 7 · both standing at the Z wall', seconds: 10, volume: 0, jobId: 'client', url: staticFile('sc7.mp4')},
  {kind: 'clip', id: 'sc8', label: 'Scene 8 · woman + gift', seconds: 4, volume: 0, jobId: 'client', url: staticFile('sc8.mp4')},
  {kind: 'clip', id: 'sc9', label: 'Scene 9 · man + gift', seconds: 10, volume: 0, jobId: 'client', url: staticFile('sc9.mp4')},
  {kind: 'clip', id: 'sc10', label: 'Scene 10 · walking away + stickers', seconds: 9, volume: 0, jobId: 'client', url: staticFile('sc10.mp4')},
  // ── White placeholder — the end (outro) slot ──
  {kind: 'mg', id: 'end-white', label: 'White placeholder · outro slot', seconds: 7.5, mg: 'white'},
];

// Transition length (frames) after beat i. Default is TRANSITION; the opening
// s1a→s1b uses a longer, gradual dip-to-black, so it gets a longer slot.
// Transition length (frames) after beat i. The intro → opening dim gets a
// slightly longer slot for a smoother screen dim; the rest are uniform.
export const transAt = (_i: number): number => TRANSITION;

// Total composition length, accounting for the (variable) cross-fade overlaps.
export const TOTAL_FRAMES =
  TIMELINE.reduce((sum, b) => sum + sec(b.seconds), 0) -
  TIMELINE.slice(0, -1).reduce((sum, _b, i) => sum + transAt(i), 0);

// Absolute start frame of each beat inside the TransitionSeries
// (each transition pulls subsequent content earlier by its own length).
export const START_FRAMES: number[] = TIMELINE.map((_, i) =>
  TIMELINE.slice(0, i).reduce((sum, b) => sum + sec(b.seconds), 0) -
  Array.from({length: i}, (_v, j) => transAt(j)).reduce((a, b) => a + b, 0),
);
