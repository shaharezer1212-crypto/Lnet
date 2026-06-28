#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=bin/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg
M=render/mp4
T=0.5   # cross-dissolve duration

# scene order + nominal durations (cumulative offset = start of each next scene)
# open 14 | reveal 7 | topics 10.3 | career 4 | why 3.9 | features 9.4 | cta 3.27  (sum 51.87)
"$FF" -hide_banner -loglevel error \
 -i $M/open.mp4 -i $M/reveal.mp4 -i $M/topics.mp4 -i $M/career.mp4 -i $M/why.mp4 -i $M/features.mp4 -i $M/cta.mp4 \
 -filter_complex "\
  [0:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[a]; \
  [1:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[b]; \
  [2:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[c]; \
  [3:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[d]; \
  [4:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[e]; \
  [5:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[f]; \
  [6:v]fps=30,format=yuv420p,setsar=1,settb=AVTB[g]; \
  [a][b]xfade=transition=fade:duration=$T:offset=14[v1]; \
  [v1][c]xfade=transition=fade:duration=$T:offset=21[v2]; \
  [v2][d]xfade=transition=fade:duration=$T:offset=31.3[v3]; \
  [v3][e]xfade=transition=fade:duration=$T:offset=34.75[v4]; \
  [v4][f]xfade=transition=fade:duration=$T:offset=43.15[v5]; \
  [v5][g]xfade=transition=fade:duration=$T:offset=48.65[v]" \
 -map "[v]" -c:v libx264 -pix_fmt yuv420p -crf 18 -r 30 $M/video_silent.mp4 -y

# mux narration+music mix
"$FF" -hide_banner -loglevel error -i $M/video_silent.mp4 -i audio/mix.wav \
  -c:v copy -c:a aac -b:a 192k -shortest render/Figma_Trailer_CampusIL.mp4 -y
echo "=== final ==="
"$FF" -hide_banner -i render/Figma_Trailer_CampusIL.mp4 2>&1 | grep Duration
