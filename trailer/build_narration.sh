#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
FF=node_modules/@ffmpeg-installer/linux-x64/ffmpeg
SRC=audio/narration_raw.mp3
WORK=audio/_work
OUT=audio/narration_edited
mkdir -p "$WORK"
rm -f "$WORK"/*.wav

# Cut points fall INSIDE detected inter-phrase silences (won't clip speech).
# Pause inserted AFTER each segment to let the matching scene breathe.
CUTS=(0 3.08 13.81 19.49 30.07 40.87 46.63 47.94 48.77)
PAUSE=(0.30 0.45 0.65 0.45 0.30 0.55 0.40)   # 7 pauses between 8 segments

# 1) extract segments as wav (clean, decoded)
N=$(( ${#CUTS[@]} - 1 ))
LIST="$WORK/list.txt"; : > "$LIST"
for ((i=0; i<N; i++)); do
  s=${CUTS[$i]}; e=${CUTS[$((i+1))]}
  seg=$(printf "%s/seg_%02d.wav" "$WORK" "$i")
  "$FF" -hide_banner -loglevel error -i "$SRC" -ss "$s" -to "$e" \
        -ar 44100 -ac 1 -c:a pcm_s16le "$seg"
  echo "file '$(basename "$seg")'" >> "$LIST"
  # append silence after every segment except the last
  if [ $i -lt $((N-1)) ]; then
    p=${PAUSE[$i]}
    sil=$(printf "%s/sil_%02d.wav" "$WORK" "$i")
    "$FF" -hide_banner -loglevel error -f lavfi -i anullsrc=r=44100:cl=mono \
          -t "$p" -c:a pcm_s16le "$sil"
    echo "file '$(basename "$sil")'" >> "$LIST"
  fi
done

# 2) concat
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i "$LIST" -c:a pcm_s16le "$WORK/joined.wav"

# 3) gentle loudness normalize + tiny fade in/out, export wav + mp3
"$FF" -hide_banner -loglevel error -i "$WORK/joined.wav" \
      -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.08" \
      -ar 44100 -ac 1 "${OUT}.wav" -y
"$FF" -hide_banner -loglevel error -i "${OUT}.wav" -codec:a libmp3lame -q:a 2 "${OUT}.mp3" -y

DUR=$("$FF" -hide_banner -i "${OUT}.wav" 2>&1 | grep Duration | head -1)
echo "DONE -> ${OUT}.mp3 / .wav"
echo "$DUR"
