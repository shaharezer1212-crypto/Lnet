#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=bin/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg   # modern ffmpeg (lanczos, unsharp)
W=render/_feat
mkdir -p "$W" render/mp4
DUR=9.4

# 1) living lavender background as its own opaque layer (so the window hole can be truly transparent)
node renderscene.mjs scenes/livingbg.html "$DUR" featbg 30

# 2) animated TRANSPARENT overlay (window chrome + popping tags/icons + wipe bars; everything else transparent)
node render_overlay_seq.mjs scenes/features_scene.html "$DUR" feat_overlay 30

# 3) three clip segments -> window size, quality up (denoise + lanczos + unsharp)
QUAL="hqdn3d=2:1:3:3,scale=1168:657:force_original_aspect_ratio=increase:flags=lanczos,crop=1168:657,unsharp=5:5:1.0:5:5:0.0,fps=30,setsar=1"
seg(){ "$FF" -hide_banner -loglevel error -ss "$2" -t "$3" -i "$1" -vf "$QUAL" -an -c:v libx264 -pix_fmt yuv420p -crf 16 "$4" -y; }
seg clips/clip3_wireframes.mp4 78 3.2 "$W/s1.mp4"
seg clips/clip2_presenter.mp4  48 3.1 "$W/s2.mp4"
seg clips/clip1_figma.mp4      33 3.1 "$W/s3.mp4"
printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\n" > "$W/list.txt"
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i "$W/list.txt" -c copy "$W/window.mp4" -y

# 4) composite: living bg + clip video at the hole + animated transparent overlay on top
"$FF" -hide_banner -loglevel error \
  -i render/mp4/featbg.mp4 -i "$W/window.mp4" -framerate 30 -i "render/frames/feat_overlay/f%04d.png" \
  -filter_complex "[0:v][1:v]overlay=376:278:shortest=1[t];[t][2:v]overlay=0:0[o]" \
  -map "[o]" -t "$DUR" -c:v libx264 -pix_fmt yuv420p -crf 17 -r 30 render/mp4/features.mp4 -y
echo "DONE render/mp4/features.mp4"
