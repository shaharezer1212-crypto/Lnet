#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=node_modules/@ffmpeg-installer/linux-x64/ffmpeg
W=render/_feat
mkdir -p "$W" render/mp4

# 1) transparent window/chrome overlay
node shot_overlay.mjs scenes/features_overlay.html "$W/overlay.png"

# 2) three clip segments scaled to the window hole (1168x657), no audio
seg(){ # src inpoint dur out
  "$FF" -hide_banner -loglevel error -ss "$2" -t "$3" -i "$1" \
    -vf "scale=1168:657:force_original_aspect_ratio=increase,crop=1168:657,fps=30,setsar=1" \
    -an -c:v libx264 -pix_fmt yuv420p -crf 18 "$4" -y
}
seg clips/clip3_wireframes.mp4 78 3.2 "$W/s1.mp4"
seg clips/clip2_presenter.mp4  48 3.1 "$W/s2.mp4"
seg clips/clip1_figma.mp4      33 3.1 "$W/s3.mp4"

# 3) concat the three window segments -> 9.4s
printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\n" > "$W/list.txt"
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i "$W/list.txt" -c copy "$W/window.mp4" -y

# 4) composite: magenta bg + window video at the hole + chrome overlay on top
"$FF" -hide_banner -loglevel error \
  -f lavfi -i "color=c=0xF35BF0:s=1920x1080:r=30:d=9.4" \
  -i "$W/window.mp4" -i "$W/overlay.png" \
  -filter_complex "[0:v][1:v]overlay=376:278:shortest=1[t];[t][2:v]overlay=0:0[o]" \
  -map "[o]" -t 9.4 -c:v libx264 -pix_fmt yuv420p -crf 17 -r 30 render/mp4/features.mp4 -y
echo "DONE render/mp4/features.mp4"
