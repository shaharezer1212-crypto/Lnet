#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=node_modules/@ffmpeg-installer/linux-x64/ffmpeg
VOICE=audio/narration_edited.wav
MUSIC=audio/music_raw.wav
OUT=audio/mix

# voice ~51.87s. Give a short music tail after the last word, then fade.
DUR=53.0

# music: loop to cover full duration; base level low (-13dB); duck under the voice
# sidechaincompress keyed by voice -> music dips when speaking, swells in the pauses.
"$FF" -hide_banner -loglevel error \
  -i "$VOICE" -stream_loop -1 -i "$MUSIC" \
  -filter_complex "\
    [0:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[vc1][vc2]; \
    [1:a]aresample=44100,atrim=0:${DUR},afade=t=in:st=0:d=0.8,volume=0.22,aformat=channel_layouts=stereo[mq]; \
    [mq][vc1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=380:makeup=1[mduck]; \
    [vc2][mduck]amix=inputs=2:duration=longest,afade=t=out:st=51.6:d=1.4,\
    loudnorm=I=-15:TP=-1.5:LRA=11[out]" \
  -map "[out]" -ar 44100 -ac 2 "${OUT}.wav" -y
"$FF" -hide_banner -loglevel error -i "${OUT}.wav" -codec:a libmp3lame -q:a 2 "${OUT}.mp3" -y
echo "DONE ${OUT}.wav/.mp3"
"$FF" -hide_banner -i "${OUT}.wav" 2>&1 | grep Duration
