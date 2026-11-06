#!/bin/sh
# Join the drawn film with the "coming alive" clip and write the web copies.
#   sh film/intro/stitch.sh <alive.mp4>
# The drawn film ends on the room laid out like the hero art; the alive clip
# starts and ends on the hero art itself. A 0.8 s dissolve joins them.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ALIVE=${1:-$HERE/alive.mp4}
DRAWN=$HERE/out/video.mp4
OUT=$HERE/out/intro-full.mp4
# the drawn film is 9.42 s; start the dissolve at 8.6 s, after the pull-back settles
ffmpeg -y -loglevel error -i "$DRAWN" -i "$ALIVE" -filter_complex "\
[0:v]fps=24,scale=1920:1080,setsar=1,format=yuv420p[a];\
[1:v]fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,format=yuv420p[b];\
[a][b]xfade=transition=fade:duration=0.8:offset=8.6[v]" -map "[v]" -an -c:v libx264 -crf 16 -preset slow "$OUT"
WEB=$HERE/../../assets/video
ffmpeg -y -loglevel error -i "$OUT" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an "$WEB/intro.mp4"
ffmpeg -y -loglevel error -i "$OUT" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an "$WEB/intro.webm"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
