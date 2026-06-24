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
      mg: 'intro' | 'logo' | 'store' | 'screens' | 'criteria' | 'outro';
      vo?: string;
      narration?: string;
      // Phased narration: staticFile path of the VO segment that STARTS here.
      narr?: string;
    };

export const sec = (s: number) => Math.round(s * FPS);

export const TIMELINE: Beat[] = [
  // ── Intro — KudoZ logo sting before the film begins ─────────────────────
  {
    kind: 'mg',
    id: 'intro',
    label: 'Intro · KudoZ logo sting',
    seconds: 3.5,
    mg: 'intro',
  },
  // ── Scene 1 — the opening, edited by the client (committed to the repo) ──
  // A single 21.1s edited take (top-down → the man → reaction → reveal), used
  // as-is. Its own audio is muted (volume 0); the phased narration + music play
  // over it. The opening VO (seg 1) starts here.
  {
    kind: 'clip',
    id: 'opening',
    label: 'S1 · client-edited opening (21.1s)',
    seconds: 21.1,
    volume: 0,
    jobId: 'client-edit',
    url: staticFile('opening.mp4'),
    narr: 'narration/1.mp3',
    narration:
      'In times of uncertainty, most people focus on the bigger picture. But this is the perfect time to acknowledge the people who keep us moving forward — because even a small compliment can give someone the boost they need.',
  },
  // ── Scene 2 — coffee toast ──────────────────────────────────────────────
  {
    kind: 'clip',
    id: 's2',
    label: 'S2 · coffee toast',
    seconds: 5,
    jobId: '5a5829e7-252f-4754-a43c-76d6fb17d26b',
    url: `${CDN}/hf_20260617_092838_5a5829e7-252f-4754-a43c-76d6fb17d26b.mp4`,
    vo: `${CDN}/hf_20260617_111108_fe0f5456-4f00-4250-b1b7-8fd2311add5b.wav`,
    narration: 'Here at ZIM, we love showing our appreciation.',
    narr: 'narration/2.mp3',
    title: 'showing our appreciation',
  },
  // ── Scene 3 — corridor cheer ────────────────────────────────────────────
  {
    kind: 'clip',
    id: 's3',
    label: 'S3 · corridor · colleague "like" → close-up smile (chosen take)',
    seconds: 6,
    jobId: '24e25606-3a4a-4c73-87f2-4a0159876fb3',
    url: `${CDN}/hf_20260617_121627_24e25606-3a4a-4c73-87f2-4a0159876fb3.mp4`,
    volume: 0, // mute the colleague's diegetic SFX in the corridor
    vo: `${CDN}/hf_20260617_111109_5c314ca9-56ad-451f-8ce4-a32f0df2cc86.wav`,
    narration: 'Putting in a good word whenever we can.',
    narr: 'narration/3.mp3',
    title: 'Putting in a good word',
    titlePos: 'left',
    titleStart: 6, // synced to the spoken line (no lead silence in the VO)
  },
  // ── Scene 4 — recognitions at the desk ──────────────────────────────────
  {
    kind: 'clip',
    id: 's4a',
    label: 'S4 · man recognized (Ben Johns)',
    seconds: 5,
    jobId: 'fb181f32-c01d-42c1-b38e-8eefc1d04f3d',
    url: `${CDN}/hf_20260617_092856_fb181f32-c01d-42c1-b38e-8eefc1d04f3d.mp4`,
    vo: `${CDN}/hf_20260617_111110_e1d8f75e-075b-459c-b4c9-08666908e7f2.wav`,
    narration: 'A small compliment here, a little gesture there.',
    narr: 'narration/4.mp3',
  },
  {
    kind: 'clip',
    id: 's4b',
    label: 'S4 · she enters → sits beside him → her recognition',
    seconds: 6.5,
    jobId: '8ff62f8e-e305-481b-9a86-ae954ea01065',
    url: `${CDN}/hf_20260617_170736_8ff62f8e-e305-481b-9a86-ae954ea01065.mp4`,
    vo: `${CDN}/hf_20260617_111111_7a90eb3e-fe0c-47d9-b5a3-ab0ad92b07fe.wav`,
    narration:
      'These are the kinds of things that create the flourishing work environment we build at ZIM.',
    narr: 'narration/5.mp3',
  },
  // ── Motion graphics 1 — logo reveal ─────────────────────────────────────
  {
    kind: 'mg',
    id: 'mg-logo',
    label: 'MG · KudoZ logo reveal',
    seconds: 6,
    mg: 'logo',
    // The whole infographic VO (logo + criteria, ~25.6s) starts here and plays
    // on across the criteria beat.
    narr: 'narration/6.mp3',
    narration: 'Introducing KudoZ — ZIM’s new employee recognition system.',
  },
  // ── Motion graphics 1b — the KudoZ system in action (screens showcase) ───
  // On the VB-BG-1 brand background: the nine real system screenshots play in a
  // designed browser frame with a clicking cursor (shown 9 → 1), with the four
  // values kept as an elegant title alongside. Replaces the old criteria cards.
  {
    kind: 'mg',
    id: 'mg-screens',
    label: 'MG · KudoZ system screens (9→1) on VB-BG-1',
    seconds: 21, // infographic VO (logo + screens) lands across these
    mg: 'screens',
  },
  // ── Scene 5 — stickers swirl → gift boxes (single cinematic take) ────────
  {
    kind: 'clip',
    id: 's5',
    label: 'S5 · stand → icons join → gifts (one take)',
    seconds: 10,
    jobId: 'edbb3073-9e4d-44d5-9686-947ff4aa1ad9',
    url: `${CDN}/hf_20260617_120010_edbb3073-9e4d-44d5-9686-947ff4aa1ad9.mp4`,
    vo: `${CDN}/hf_20260617_111115_448f9c75-8221-4876-b2b0-ba1755c2cc65.wav`,
    narration: 'Receiving recognition awards points that can be redeemed for amazing gifts.',
    narr: 'narration/7.mp3',
  },
  // ── Ending ──────────────────────────────────────────────────────────────
  {
    kind: 'clip',
    id: 'end-woman',
    label: 'END · woman + gift',
    seconds: 4,
    jobId: '3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4',
    url: `${CDN}/hf_20260617_102730_3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4.mp4`,
    // The ending VO (~18s) starts here and plays across woman + man + walk.
    narr: 'narration/8.mp3',
  },
  {
    kind: 'clip',
    id: 'end-man',
    label: 'END · man + floating mascots (push-in)',
    seconds: 8, // gently slowed to give the ending VO room
    playbackRate: 0.75, // 6s take over 8s
    jobId: 'bf0b155d-4994-4306-b3c8-d9933f8e3122',
    url: `${CDN}/hf_20260617_145326_bf0b155d-4994-4306-b3c8-d9933f8e3122.mp4`,
  },
  {
    kind: 'clip',
    id: 'end-walk',
    label: 'END · walk away into the distance (identity-locked, correct direction)',
    seconds: 8, // gently slowed to extend the closing walk under the ending VO
    playbackRate: 0.75, // 6s take over 8s
    jobId: 'f0f654ff-2481-4ee7-8b28-61ce3ae16dce',
    url: `${CDN}/hf_20260617_194946_f0f654ff-2481-4ee7-8b28-61ce3ae16dce.mp4`,
    vo: `${CDN}/hf_20260617_111123_0b821fa2-77cb-4890-9057-6a8434a1d484.wav`,
    narration:
      'Together, we’ll create a positive work environment built on trust, recognition and mutual support.',
  },
  // ── Motion graphics 3 — outro logo + tagline ────────────────────────────
  {
    kind: 'mg',
    id: 'mg-outro',
    label: 'MG · outro tagline',
    seconds: 7.5,
    mg: 'outro',
    narr: 'narration/9.mp3',
    narration: 'KudoZ — where appreciation becomes culture.',
  },
];

// Transition length (frames) after beat i. Default is TRANSITION; the opening
// s1a→s1b uses a longer, gradual dip-to-black, so it gets a longer slot.
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
