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
export const MUSIC_VOLUME = 0.15;
// Diegetic clip audio is ducked under the narration (per-clip override via beat.volume).
export const CLIP_VOLUME = 0.26;

// Single continuous narration (Ashley) — one take, no per-line overlap.
export const NARRATION_URL = `${CDN}/hf_20260617_130038_d1487192-cf5f-4e19-843e-ab21785fa213.wav`;
// Small lead-in so the voice doesn't start on the very first frame.
export const NARRATION_START = 8;
// Narration amplified a touch so it leads the mix.
export const NARRATION_VOLUME = 1.4;

// ── Brand assets (fill when provided) ───────────────────────────────────────
// Official KudoZ logo, background removed (transparent) — for clean close-ups.
export const LOGO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC/hf_20260617_153217_99b4c052-332b-4f3a-89ed-78799f70718b.png';
// B-roll of the work environment, shown in the system/values section.
// Empty → a labelled placeholder panel is shown instead.
export const FOOTAGE_URL = '';

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
  // ── Scene 1 — both employees get recognized (ONE continuous take) ───────
  // The whole scene is now a single 10s Seedance take built from the four
  // approved storyboard frames (man calm → BREAKING NEWS card → wide two-shot
  // → woman close-up), so there is no cut anywhere in the opening. Trimmed to
  // 284 frames so the merged opening keeps the exact length of the old two
  // clips and the continuous narration stays perfectly in sync.
  {
    kind: 'clip',
    id: 's1',
    label: 'S1 · full scene · calm → alert → reveal → woman (one take)',
    seconds: 9.467, // 284 frames @30fps — preserves downstream narration sync
    jobId: 'd6e4aeab-e6a1-464f-9294-01b1e928fc05',
    url: `${CDN}/hf_20260617_191155_d6e4aeab-e6a1-464f-9294-01b1e928fc05.mp4`,
    vo: `${CDN}/hf_20260617_111107_11a6c341-e8bd-45d9-8748-cbe90222006c.wav`,
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
    title: 'Putting in a good word',
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
    label: 'END · walk away into the distance (identity-locked, correct direction)',
    seconds: 6,
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
