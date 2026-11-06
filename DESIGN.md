# DESIGN.md: Claude, השותף החדש שלך

The contract every page of this site follows (landing, portal, admin). Source of truth for tokens: `:root` in `assets/css/site.css`. Do not invent one-off values; add a token here first.

## Direction

The page is the pencil sketch from the course art: white drawing paper, graphite, ink, and colour only where the sketch has it: the 3D characters (Shahar, Claude, the butterfly), the colored-pencil green of the chairs and plants, and the butterfly purple. Bold condensed Hebrew from the flyer.

**One idea, everywhere:** the page gets drawn while you scroll, the way the intro film draws the room. Card frames are pencil outlines that trace themselves in; a pencil line runs down the syllabus with the 3D butterfly flying along it and colouring each session it passes; Claude and the butterfly are cut-outs that move with the scroll (walk in, perch, peek, jump, walk home). Nothing moves on its own except the butterfly's flutter.

## Color

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#f8f8f6` | Page background: white drawing paper with a faint grain (same white as the intro film) |
| `--paper-deep` | `#ececea` | Quiet fills: locked sessions, file badges |
| `--ink` | `#000` | Text, outlines (1.5px), primary buttons, the price card |
| `--graphite` | `#3b3b3b` | Pencil lines: hand-drawn frames, hatching, secondary text |
| `--pencil` | `#a3a3a3` | Dashed dividers, header rule |
| `--clay` | `#d97757` | Claude. Only for the word "Claude," in the hero |
| `--leaf` | `#93c83e` | Colored-pencil green of the chairs: bullets, checks, CTA block (with pencil strokes over it), "next session" ring |
| `--wing` | `#8b4fd6` | The butterfly: timeline ink line, focus ring |
| `--sun` | `#f2b84b` | Info dot, strike-through on the old price |

## Type

- **FbGazoz** (Regular 400, Bold 700): all Hebrew. Headings bold, body regular.
- **Josefin Sans**: Latin words only (loaded with `unicode-range`, so "Claude", "Skills" switch automatically mid-sentence).
- **Josefin Display** (same file, no range): big numerals only: price, countdown.
- Scale: `--step--1` to `--step-4` (fluid `clamp`). Headings line-height 0.95, body 1.5. Measure ≤ 62ch.
- No all-caps labels (except the flyer slogan "TIME TO LEVEL-UP!"), no eyebrows, no single-word color accents beyond "Claude,".

## Shape

- Outlines: on the landing page, hand-drawn pencil frames (`[data-sketch]`, drawn by main.js); elsewhere `1.5px solid var(--ink)`.
- Shadows: never soft. Cards that need depth get a hatched pencil shadow (`.hatched`).
- Radius: `--radius-card` 28px (cards, as in the flyer), `--radius-pill` for buttons, 14px for inputs/file rows, 50% for numbered dots.
- Numbered circles (1 to 4) only for the sessions, because they are a real sequence.

## Spacing

- Page gutter `--gutter` (16px on phones to 48px). Content width 1180px.
- Section padding `clamp(4rem, 10vw, 8rem)`.

## Motion

1. **Intro** (once per browser session, skippable, Esc skips): the film `assets/video/intro.mp4`, or the drawn fallback where pencil lines sketch the room and the hero image opens in a circle.
2. **Timeline line + butterfly**: tied to scroll position.
3. **Hero parallax**: max 40px.
4. Buttons lift 2px on hover. Nothing else animates by itself.
- `prefers-reduced-motion`: intro removed, line fully drawn, no parallax, no wing flap.

## Components

Header (logo + section links + participant entry), hero, promise, session card, host, price card, checklist, info note, CTA block, contact form, footer, portal gate, next-up bar, module (`<details>`), player, file row with kind badge, admin card.
