#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=/home/user/Lnet/trailer/bin/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg
R=render; T=render/titles
PUNCH="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,zoompan=z='if(lte(in,10),1.12-0.012*in,1.0)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30,setsar=1,format=yuv420p"
FILL916="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p"
VENC="-c:v libx264 -pix_fmt yuv420p -crf 19 -r 30"; AENC="-c:a aac -ar 44100 -ac 2 -b:a 192k"

# seg1: pres1 + logo lower-third (fade 0.6-4.6)
"$FF" -hide_banner -loglevel error -i clips/pres1.mp4 -loop 1 -i $T/logo.png -filter_complex \
 "[0:v]$PUNCH[v];[1:v]format=rgba,fade=t=in:st=0.6:d=0.35:alpha=1,fade=t=out:st=4.3:d=0.4:alpha=1[lt];[v][lt]overlay=0:0[vo]" \
 -map "[vo]" -map 0:a -t 11.28 $VENC $AENC $R/seg1.mp4 -y

# seg3: pres2 + 6 keyword titles synced
"$FF" -hide_banner -loglevel error -i clips/pres2.mp4 \
 -loop 1 -i $T/kw1.png -loop 1 -i $T/kw2.png -loop 1 -i $T/kw3.png -loop 1 -i $T/kw4.png -loop 1 -i $T/kw5.png -loop 1 -i $T/kw6.png \
 -filter_complex \
 "[0:v]$PUNCH[v]; \
  [1:v]format=rgba,fade=t=in:st=1.8:d=0.3:alpha=1,fade=t=out:st=3.9:d=0.3:alpha=1[k1]; \
  [2:v]format=rgba,fade=t=in:st=4.6:d=0.3:alpha=1,fade=t=out:st=6.6:d=0.3:alpha=1[k2]; \
  [3:v]format=rgba,fade=t=in:st=7.3:d=0.3:alpha=1,fade=t=out:st=9.3:d=0.3:alpha=1[k3]; \
  [4:v]format=rgba,fade=t=in:st=9.9:d=0.3:alpha=1,fade=t=out:st=11.9:d=0.3:alpha=1[k4]; \
  [5:v]format=rgba,fade=t=in:st=12.4:d=0.3:alpha=1,fade=t=out:st=14.5:d=0.3:alpha=1[k5]; \
  [6:v]format=rgba,fade=t=in:st=15.0:d=0.3:alpha=1,fade=t=out:st=18.4:d=0.3:alpha=1[k6]; \
  [v][k1]overlay=0:0[o1];[o1][k2]overlay=0:0[o2];[o2][k3]overlay=0:0[o3];[o3][k4]overlay=0:0[o4];[o4][k5]overlay=0:0[o5];[o5][k6]overlay=0:0[vo]" \
 -map "[vo]" -map 0:a -t 21.32 $VENC $AENC $R/seg3.mp4 -y

# seg4: course clips full 9:16 (no bg, no titles) + Alma VO
"$FF" -hide_banner -loglevel error -ss 1 -t 3.2 -i clips/course1.mp4 -ss 0.5 -t 3.15 -i clips/course2.mp4 -i audio/vo_alma.mp3 \
 -filter_complex "[0:v]$FILL916,settb=AVTB[c1];[1:v]$FILL916,settb=AVTB[c2];[c1][c2]concat=n=2:v=1:a=0[vo]" \
 -map "[vo]" -map 2:a -t 6.35 $VENC $AENC $R/seg4.mp4 -y

# seg5: pres3 (punch)
"$FF" -hide_banner -loglevel error -i clips/pres3.mp4 -filter_complex "[0:v]$PUNCH[v]" -map "[v]" -map 0:a -t 12.16 $VENC $AENC $R/seg5.mp4 -y

# concat (no logo bumper now)
printf "file 'seg1.mp4'\nfile 'seg3.mp4'\nfile 'seg4.mp4'\nfile 'seg5.mp4'\n" > $R/reel2list.txt
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i $R/reel2list.txt -c copy $R/reel_speech.mp4 -y

# add BGM (Figma trailer music) ducked under speech
"$FF" -hide_banner -loglevel error -i $R/reel_speech.mp4 -stream_loop -1 -i /home/user/Lnet/trailer/audio/music_raw.wav \
 -filter_complex "[0:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[sp1][sp2]; \
   [1:a]aresample=44100,aformat=channel_layouts=stereo,volume=0.16[mv]; \
   [mv][sp1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md]; \
   [sp2][md]amix=inputs=2:duration=first,afade=t=out:st=50.0:d=1.0[aout]" \
 -map 0:v -map "[aout]" -c:v copy $AENC -shortest render/PM_Reel.mp4 -y
echo "=== reel v2 ==="
"$FF" -hide_banner -i render/PM_Reel.mp4 2>&1 | grep -E "Duration|Stream"
