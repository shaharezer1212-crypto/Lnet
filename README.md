# KudoZ — ZIM launch video (Remotion)

Assembles the ZIM **KudoZ** launch film from the Higgsfield (Seedance 2.0)
clips plus native motion-graphics beats (logo reveal, the four reward
criteria, outro tagline) into one continuous cinematic edit.

## Run

```bash
npm install
npm run dev        # open Remotion Studio to preview/scrub
npm run render     # render to out/kudoz.mp4 (1080p, 30fps)
```

> The live-action clips stream from the Higgsfield CDN at preview/render time,
> so the rendering machine needs internet access.

## Structure

- `src/clips.ts` — the **single source of truth**: the ordered timeline, one
  clip per beat (no duplicates), each with its Higgsfield `jobId` for
  traceability, plus the motion-graphics beats and the cross-fade length.
- `src/KudoZVideo.tsx` — stitches every beat with a `TransitionSeries` fade.
- `src/Clip.tsx` — plays a clip (or a labelled placeholder while a clip is
  still re-rendering).
- `src/mg/` — `LogoReveal`, `Criteria`, `Outro` motion-graphics scenes.

## Edit order (matches the storyboard)

1. Scene 1 — both employees get recognized (3 shots)
2. Scene 2 — coffee toast
3. Scene 3 — corridor cheer
4. Scene 4 — two desk recognitions (Ben Johns / Jen Moore)
5. **MG** — KudoZ logo reveal
6. **MG** — the four reward criteria
7. Scene 5 — stickers swirl → gift boxes (one cinematic take)
8. Ending — woman + gift → man + logo → walk away together
9. **MG** — outro tagline

## Status

All 11 clips are wired in `src/clips.ts` (the two ending shots were
re-rendered after an NSFW false-positive and are now filled in). The project
typechecks and Remotion resolves the `KudoZ` composition (1920×1080, 30fps,
67.5s).
