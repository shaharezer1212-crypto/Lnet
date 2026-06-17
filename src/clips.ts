// ──────────────────────────────────────────────────────────────────────────
// KudoZ — final clip set (Higgsfield / Seedance 2.0, dynamic style).
// ONE clip per beat. No duplicates, no abandoned "gentle" takes.
// Live-action clips stream from the Higgsfield CDN; motion-graphics beats are
// rendered natively in Remotion.
// ──────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Cross-fade length between every segment (frames).
export const TRANSITION = 15;

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_2was4m5nNqvV4UXqUb4RJpsZmoC';

export type Beat =
  | {
      kind: 'clip';
      id: string;
      label: string;
      seconds: number;
      // Higgsfield job_id this clip was rendered from (traceability / re-render).
      jobId: string;
      url: string;
      narration?: string;
    }
  | {
      kind: 'mg';
      id: string;
      label: string;
      seconds: number;
      mg: 'logo' | 'criteria' | 'outro';
      narration?: string;
    };

export const sec = (s: number) => Math.round(s * FPS);

export const TIMELINE: Beat[] = [
  // ── Scene 1 — both employees get recognized ────────────────────────────
  {
    kind: 'clip',
    id: 's1a',
    label: 'S1 · calm → BREAKING NEWS',
    seconds: 4,
    jobId: 'dc437cc7-52f4-456b-9cf7-8683823f758d',
    url: `${CDN}/hf_20260617_092819_dc437cc7-52f4-456b-9cf7-8683823f758d.mp4`,
    narration:
      'In times of uncertainty, this is the perfect time to acknowledge the people around us.',
  },
  {
    kind: 'clip',
    id: 's1b',
    label: 'S1 · reveal the woman',
    seconds: 5,
    jobId: '13fb478f-ac39-4d84-b54a-0887a4e9ed04',
    url: `${CDN}/hf_20260617_090730_13fb478f-ac39-4d84-b54a-0887a4e9ed04.mp4`,
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
    narration: 'Here at ZIM, we love showing our appreciation.',
  },
  // ── Scene 3 — corridor cheer ────────────────────────────────────────────
  {
    kind: 'clip',
    id: 's3',
    label: 'S3 · corridor cheer',
    seconds: 5,
    jobId: 'b3232287-3ebd-496d-9476-c29761c678cc',
    url: `${CDN}/hf_20260617_092847_b3232287-3ebd-496d-9476-c29761c678cc.mp4`,
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
    narration: 'A small compliment here, a little gesture there.',
  },
  {
    kind: 'clip',
    id: 's4b',
    label: 'S4 · woman recognized (Jen Moore)',
    seconds: 5,
    jobId: 'e4b07837-5454-4aaf-bc5b-6938570d7143',
    url: `${CDN}/hf_20260617_092905_e4b07837-5454-4aaf-bc5b-6938570d7143.mp4`,
    narration:
      'These are the kinds of things that create the flourishing work environment we build at ZIM.',
  },
  // ── Motion graphics 1 — logo reveal ─────────────────────────────────────
  {
    kind: 'mg',
    id: 'mg-logo',
    label: 'MG · KudoZ logo reveal',
    seconds: 3,
    mg: 'logo',
    narration: 'Introducing: KudoZ — ZIM’s new employee recognition system.',
  },
  // ── Motion graphics 2 — the four criteria ───────────────────────────────
  {
    kind: 'mg',
    id: 'mg-criteria',
    label: 'MG · four criteria',
    seconds: 10,
    mg: 'criteria',
    narration:
      'Managers can reward employees on four criteria: Core Values, Initiative & Innovation, Special Contribution, and Collaboration.',
  },
  // ── Scene 5 — stickers swirl → gift boxes (single cinematic take) ────────
  {
    kind: 'clip',
    id: 's5',
    label: 'S5 · stickers → gifts (one take)',
    seconds: 8,
    jobId: 'de24c5ab-04b5-4c14-b708-a303fac39e4a',
    url: `${CDN}/hf_20260617_095351_de24c5ab-04b5-4c14-b708-a303fac39e4a.mp4`,
    narration:
      'Recognition awards points that can be redeemed for amazing gifts.',
  },
  // ── Ending ──────────────────────────────────────────────────────────────
  {
    kind: 'clip',
    id: 'end-woman',
    label: 'END · woman + gift',
    seconds: 4,
    jobId: '3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4',
    url: `${CDN}/hf_20260617_102730_3eba2d5a-c69e-41fa-a71c-7a34aae3b4f4.mp4`,
    narration: 'Employees can view, congratulate and CheerZ one another.',
  },
  {
    kind: 'clip',
    id: 'end-man',
    label: 'END · man + KudoZ logo',
    seconds: 5,
    jobId: '542fd502-afd4-493d-b629-66772bc0d48a',
    url: `${CDN}/hf_20260617_102744_542fd502-afd4-493d-b629-66772bc0d48a.mp4`,
  },
  {
    kind: 'clip',
    id: 'end-walk',
    label: 'END · walk away together',
    seconds: 6,
    jobId: 'd07619b6-5e2f-4967-b69d-c9a390c63586',
    url: `${CDN}/hf_20260617_095415_d07619b6-5e2f-4967-b69d-c9a390c63586.mp4`,
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
    narration: 'KudoZ — Where appreciation becomes culture.',
  },
];

// Total composition length, accounting for the cross-fade overlaps.
export const TOTAL_FRAMES =
  TIMELINE.reduce((sum, b) => sum + sec(b.seconds), 0) -
  (TIMELINE.length - 1) * TRANSITION;
