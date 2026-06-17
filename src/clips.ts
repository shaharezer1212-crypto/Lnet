// ──────────────────────────────────────────────────────────────────────────
// KudoZ — final clip set (Higgsfield / Seedance 2.0, dynamic style).
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

// Background music — "bold modern urban pop beat with attitude" (option 2),
// full 68s render.
export const MUSIC_URL = `${CDN}/hf_20260617_112051_5f73edae-9eca-4e92-b330-9c4e07fd54ee.m4a`;
// Music sits under the voice-over but stays present.
export const MUSIC_VOLUME = 0.18;
// Diegetic clip audio is ducked under the narration (per-clip override via beat.volume).
export const CLIP_VOLUME = 0.28;

// Single continuous narration (Ashley) — one take, no per-line overlap.
export const NARRATION_URL = `${CDN}/hf_20260617_130038_d1487192-cf5f-4e19-843e-ab21785fa213.wav`;
// Small lead-in so the voice doesn't start on the very first frame.
export const NARRATION_START = 8;

// ── Brand assets (fill when provided) ───────────────────────────────────────
// Official KudoZ logo, background removed (transparent) — for clean close-ups.
export const LOGO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC/hf_20260617_153217_99b4c052-332b-4f3a-89ed-78799f70718b.png';
// B-roll of the work environment, shown in the system/values section.
// Empty → a labelled placeholder panel is shown instead.
export const FOOTAGE_URL = '';

// Real KudoZ sticker artwork — background removed (transparent) — that
// floats/pops around the MG scenes.
const OUT = 'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC';
export const STICKERS: string[] = [
  `${OUT}/hf_20260617_174409_47d6b77f-01c1-4cf4-abc1-79d085d1243b.png`,
  `${OUT}/hf_20260617_174426_a6a4ccf8-6088-45cf-b6f1-8f468dfa1fef.png`,
  `${OUT}/hf_20260617_174428_01e27052-1257-48a6-9964-cc7108d9cc19.png`,
  `${OUT}/hf_20260617_174430_e79876ae-6ee9-4f8d-af3a-2d0894905171.png`,
  `${OUT}/hf_20260617_174432_c8ec7aec-cbf3-4244-8c90-31a17542d785.png`,
  `${OUT}/hf_20260617_174434_ce8f8c80-67e9-4743-870d-7ba8e0aa3597.png`,
  `${OUT}/hf_20260617_174435_815acea9-e56a-4aaf-a06b-6a3eb8a62da1.png`,
  `${OUT}/hf_20260617_174437_bd82c00d-31cf-4508-999c-06fccca2a74f.png`,
  `${OUT}/hf_20260617_174438_f9789543-c7a6-4f67-94a0-b79cda6a819b.png`,
  `${OUT}/hf_20260617_174451_8b39daed-2971-4d47-b9cf-61cd687ffdcf.png`,
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
    }
  | {
      kind: 'mg';
      id: string;
      label: string;
      seconds: number;
      mg: 'logo' | 'criteria' | 'outro';
      vo?: string;
      narration?: string;
    };

export const sec = (s: number) => Math.round(s * FPS);

export const TIMELINE: Beat[] = [
  // ── Scene 1 — both employees get recognized ────────────────────────────
  // Opens on the APPROVED reveal clip (man already has the alert → camera
  // pulls back to reveal the woman). The old "calm → alert" clip was removed
  // because it repeated the BREAKING NEWS beat. This clip ends on the wide
  // two-shot and the next clip starts on the same two-shot → seamless join.
  {
    kind: 'clip',
    id: 's1b',
    label: 'S1 · reveal the woman (approved)',
    seconds: 5,
    jobId: '13fb478f-ac39-4d84-b54a-0887a4e9ed04',
    url: `${CDN}/hf_20260617_090730_13fb478f-ac39-4d84-b54a-0887a4e9ed04.mp4`,
    vo: `${CDN}/hf_20260617_111107_11a6c341-e8bd-45d9-8748-cbe90222006c.wav`,
    narration:
      'In times of uncertainty, most people focus on the bigger picture. But this is the perfect time to acknowledge the people who keep us moving forward — because even a small compliment can give someone the boost they need.',
  },
  {
    kind: 'clip',
    id: 's1c',
    label: 'S1 · woman · AN UPDATE',
    seconds: 5,
    jobId: 'd2787728-7c6e-4492-8296-84a63da8c4fe',
    url: `${CDN}/hf_20260617_092830_d2787728-7c6e-4492-8296-84a63da8c4fe.mp4`,
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
  },
  {
    kind: 'clip',
    id: 's4b',
    label: 'S4 · she enters → sits beside him → her recognition',
    seconds: 6,
    jobId: '8ff62f8e-e305-481b-9a86-ae954ea01065',
    url: `${CDN}/hf_20260617_170736_8ff62f8e-e305-481b-9a86-ae954ea01065.mp4`,
    vo: `${CDN}/hf_20260617_111111_7a90eb3e-fe0c-47d9-b5a3-ab0ad92b07fe.wav`,
    narration:
      'These are the kinds of things that create the flourishing work environment we build at ZIM.',
  },
  // ── Motion graphics 1 — logo reveal ─────────────────────────────────────
  {
    kind: 'mg',
    id: 'mg-logo',
    label: 'MG · KudoZ logo reveal',
    seconds: 4,
    mg: 'logo',
    vo: `${CDN}/hf_20260617_111112_cf1c387b-80e1-4aef-a6b2-d27ccee0d16f.wav`,
    narration: 'Introducing KudoZ — ZIM’s new employee recognition system.',
  },
  // ── Motion graphics 2 — the four criteria ───────────────────────────────
  {
    kind: 'mg',
    id: 'mg-criteria',
    label: 'MG · four criteria',
    seconds: 10,
    mg: 'criteria',
    vo: `${CDN}/hf_20260617_111113_e3b7a421-cc8e-449c-9eed-2b30eabb32c8.wav`,
    narration:
      'Managers can reward employees on four criteria: Core Values, Initiative and Innovation, Special Contribution, and Collaboration.',
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
  },
  // ── Ending ──────────────────────────────────────────────────────────────
  {
    kind: 'clip',
    id: 'end-woman',
    label: 'END · woman + gift',
    seconds: 4,
    jobId: '3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4',
    url: `${CDN}/hf_20260617_102730_3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4.mp4`,
  },
  {
    kind: 'clip',
    id: 'end-man',
    label: 'END · man + floating mascots (push-in)',
    seconds: 6,
    jobId: 'bf0b155d-4994-4306-b3c8-d9933f8e3122',
    url: `${CDN}/hf_20260617_145326_bf0b155d-4994-4306-b3c8-d9933f8e3122.mp4`,
  },
  {
    kind: 'clip',
    id: 'end-walk',
    label: 'END · walk away from behind (clean corridor)',
    seconds: 6,
    jobId: '5e4992a7-3e4c-47ec-841f-ec5b3359aa7f',
    url: `${CDN}/hf_20260617_121248_5e4992a7-3e4c-47ec-841f-ec5b3359aa7f.mp4`,
    vo: `${CDN}/hf_20260617_111123_0b821fa2-77cb-4890-9057-6a8434a1d484.wav`,
    narration:
      'Together, we’ll create a positive work environment built on trust, recognition and mutual support.',
  },
  // ── Motion graphics 3 — outro logo + tagline ────────────────────────────
  {
    kind: 'mg',
    id: 'mg-outro',
    label: 'MG · outro tagline',
    seconds: 4,
    mg: 'outro',
    vo: `${CDN}/hf_20260617_111124_cec86c87-f540-4869-89c9-8756dd0790ae.wav`,
    narration: 'KudoZ — where appreciation becomes culture.',
  },
];

// Total composition length, accounting for the cross-fade overlaps.
export const TOTAL_FRAMES =
  TIMELINE.reduce((sum, b) => sum + sec(b.seconds), 0) -
  (TIMELINE.length - 1) * TRANSITION;

// Absolute start frame of each beat inside the TransitionSeries
// (each transition pulls subsequent content earlier by TRANSITION frames).
export const START_FRAMES: number[] = TIMELINE.map((_, i) =>
  TIMELINE.slice(0, i).reduce((sum, b) => sum + sec(b.seconds), 0) - i * TRANSITION,
);
