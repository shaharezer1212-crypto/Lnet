import { BRAND } from "./brand";

// ────────────────────────────────────────────────────────────────────────────
//  THE EDIT — ordered list of segments (18 scenes; scene 5 is a montage).
//  Mapping of clips→scenes is a best-guess from the footage; easy to reorder:
//  just change the `clip` of each segment. Durations are each clip's real length.
//  Each clip plays with ITS OWN audio (presenter lip-sync + voiceover).
// ────────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TRANSITION_SECONDS = 0.5;

// Clip audio is gibberish/ambient — mute every clip and use the master
// narration as the single voice track.
export const MUTE_CLIPS = true;

// The continuous master voiceover (narration_1+2+3 concatenated, ~180s).
// It starts when scene 1 begins (right after the opening logo card).
export const NARRATION = "audio/narration_full.mp3";

// Background music: "First Date" plays the calm intro and cuts out at the
// freeze; "Up" takes over (rhythmic) for the rest. Both duck under narration.
export const MUSIC_INTRO = "audio/music/first_date.mp3";
export const MUSIC_BODY = "audio/music/up.mp3";
export const MUSIC_DUCK = 0.16; // level under narration
export const MUSIC_OPEN = 0.42; // level during the opening (no narration yet)

export type Title = {
  lines: string[]; // one or more lines (RTL Hebrew)
  accent?: string; // bar / accent color
  rotate?: boolean; // if true, lines are shown one-at-a-time (kinetic rotation)
};

export type Segment = {
  scene: number; // logical scene number
  clip: string; // path under /public
  durationSeconds: number; // the clip's real duration
  title?: Title; // optional on-screen title from the script
  freeze?: boolean; // the "we got stuck" freeze + TV-glitch SFX moment
  presenter?: boolean; // דר clip: play its OWN audio (lip-sync), mute master VO here
  note?: string;
};

const A = BRAND;

// Order per the client's narrative:
// open → workers stuck (freeze) → דר1 → joins group on roof → day-routine clip
// → day breakdown → דר monologues → binoculars → crane/container rises (last).
export const segments: Segment[] = [
  { scene: 1, clip: "clips/scenes/scene_01.mp4", durationSeconds: 15.07, note: "כניסה מלמעלה + עובדים" },
  { scene: 2, clip: "clips/scenes/scene_02.mp4", durationSeconds: 7.06, freeze: true, note: "מחסן — נתקעים, פריז+SFX" },
  { scene: 3, clip: "clips/presenter/presenter_1.mp4", durationSeconds: 15.0, presenter: true, note: "דר 1 מקריין (נחתך זנב ג'יבריש)" },
  { scene: 4, clip: "clips/scenes/scene_03.mp4", durationSeconds: 15.07, title: { lines: ["בלב העשייה"], accent: A.leaf }, note: "מתהלך ומצטרף לקבוצה על הגג" },
  { scene: 5, clip: "clips/scenes/scene_04.mp4", durationSeconds: 15.07, note: "יום-יום בסרטון אחד (מסתיים בדר)" },
  { scene: 6, clip: "clips/scenes/scene_05.mp4", durationSeconds: 8.06, title: { lines: ["הנפקת ציוד"], accent: A.red }, note: "פותח מחסן" },
  { scene: 7, clip: "clips/scenes/scene_10.mp4", durationSeconds: 7.04, note: "לוקח ציוד" },
  { scene: 8, clip: "clips/scenes/scene_06.mp4", durationSeconds: 5.06, title: { lines: ["פריוריטי מובייל", "פורטל רכש"], accent: A.blue, rotate: true }, note: "כלים דיגיטליים" },
  { scene: 9, clip: "clips/scenes/scene_08.mp4", durationSeconds: 15.07, title: { lines: ["מעקב אחר הזמנות"], accent: A.orange }, note: "מעקב/סיור" },
  { scene: 10, clip: "clips/scenes/scene_07.mp4", durationSeconds: 8.06, title: { lines: ["קבלת סחורות"], accent: A.leaf }, note: "יוצא לקבל משאיות" },
  { scene: 11, clip: "clips/presenter/presenter_2.mp4", durationSeconds: 3.73, presenter: true, note: "דר 2" },
  { scene: 12, clip: "clips/scenes/scene_12.mp4", durationSeconds: 15.07, title: { lines: ["ההתארגנות"], accent: A.pink }, note: "בשטח עם הצוות" },
  { scene: 13, clip: "clips/presenter/presenter_3.mp4", durationSeconds: 9.33, presenter: true, note: "דר 3" },
  { scene: 14, clip: "clips/presenter/presenter_4.mp4", durationSeconds: 8.0, presenter: true, title: { lines: ["מענה מהיר", "פתרון בעיות", "קור רוח"], accent: A.red, rotate: true }, note: "דר 4" },
  { scene: 15, clip: "clips/presenter/presenter_5.mp4", durationSeconds: 8.0, presenter: true, note: "דר 5" },
  { scene: 16, clip: "clips/presenter/presenter_6.mp4", durationSeconds: 7.2, presenter: true, note: "דר 6" },
  { scene: 17, clip: "clips/scenes/scene_11.mp4", durationSeconds: 10.05, title: { lines: ["תראו את הנולד"], accent: A.blue }, note: "משקפת" },
  { scene: 18, clip: "clips/presenter/presenter_7.mp4", durationSeconds: 3.73, presenter: true, note: "דר 7 — משקפת" },
  { scene: 19, clip: "clips/scenes/scene_09.mp4", durationSeconds: 6.06, note: "סיום — מכולה/ציוד עולה במנוף" },
];

export const OPENING_SECONDS = 4;
export const CLOSING_SECONDS = 8;
