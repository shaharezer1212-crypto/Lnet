# Lnet — Remotion Video Project

Assembling AI-generated clips + narration into a finished video with transitions.

## Quick start

```bash
npm install
npm run dev      # open Remotion Studio to preview
npm run build    # render to out/video.mp4
```

## How to assemble your edit

1. Put your video clips in `public/clips/`
2. Put your narration / music in `public/audio/`
3. Edit `src/clips.ts` — list clips in order with durations, set narration

That is the only file you normally touch.
