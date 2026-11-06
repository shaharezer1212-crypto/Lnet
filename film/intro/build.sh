#!/bin/sh
# Rebuild the intro film: sh film/intro/build.sh   (needs the Lemo-Opuscar library; LIB= its path)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
cp "$HERE/out/video.mp4" "$HERE/intro.mp4"
# web copy for the site: no audio track, fast start
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an "$HERE/../../assets/video/intro.mp4"
ffmpeg -y -loglevel error -sseof -0.05 -i "$HERE/out/video.mp4" -frames:v 1 "$HERE/poster.jpg"
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an "$HERE/../../assets/video/intro.webm"
