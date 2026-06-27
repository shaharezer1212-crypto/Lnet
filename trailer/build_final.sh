#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=node_modules/@ffmpeg-installer/linux-x64/ffmpeg
M=render/mp4

# scene order
ORDER=(open reveal topics why features cta)
printf "" > "$M/final_list.txt"
for s in "${ORDER[@]}"; do echo "file '$s.mp4'" >> "$M/final_list.txt"; done

# 1) concat video (re-encode to guarantee uniform stream params)
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i "$M/final_list.txt" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -r 30 "$M/video_silent.mp4" -y

# 2) mux with the narration+music mix
"$FF" -hide_banner -loglevel error -i "$M/video_silent.mp4" -i audio/mix.wav \
  -c:v copy -c:a aac -b:a 192k -shortest render/Figma_Trailer_CampusIL.mp4 -y

echo "=== final ==="
"$FF" -hide_banner -i render/Figma_Trailer_CampusIL.mp4 2>&1 | grep -E "Duration|Stream"
ls -la render/Figma_Trailer_CampusIL.mp4
