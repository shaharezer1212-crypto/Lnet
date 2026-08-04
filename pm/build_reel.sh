#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FF=/home/user/Lnet/trailer/bin/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg
R=render
PUNCH="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,zoompan=z='if(lte(in,10),1.12-0.012*in,1.0)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30,setsar=1,format=yuv420p"
VENC="-c:v libx264 -pix_fmt yuv420p -crf 19 -r 30"
AENC="-c:a aac -ar 44100 -ac 2 -b:a 192k"

# seg1: pres1 (punch) + audio
"$FF" -hide_banner -loglevel error -i clips/pres1.mp4 -filter_complex "[0:v]$PUNCH[v]" -map "[v]" -map 0:a $VENC $AENC $R/seg1.mp4 -y
# seg2: logo bumper (silent)
"$FF" -hide_banner -loglevel error -i $R/logo.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -map 0:v -map 1:a -t 1.4 $VENC $AENC $R/seg2.mp4 -y
# seg3: pres2 (punch) + audio
"$FF" -hide_banner -loglevel error -i clips/pres2.mp4 -filter_complex "[0:v]$PUNCH[v]" -map "[v]" -map 0:a $VENC $AENC $R/seg3.mp4 -y
# seg4: VO section (re-encode audio to stereo)
"$FF" -hide_banner -loglevel error -i $R/vo_section.mp4 -map 0:v -map 0:a $VENC $AENC $R/seg4.mp4 -y
# seg5: pres3 (punch) + audio
"$FF" -hide_banner -loglevel error -i clips/pres3.mp4 -filter_complex "[0:v]$PUNCH[v]" -map "[v]" -map 0:a $VENC $AENC $R/seg5.mp4 -y

printf "file 'seg1.mp4'\nfile 'seg2.mp4'\nfile 'seg3.mp4'\nfile 'seg4.mp4'\nfile 'seg5.mp4'\n" > $R/reellist.txt
"$FF" -hide_banner -loglevel error -f concat -safe 0 -i $R/reellist.txt -c copy render/PM_Reel.mp4 -y
echo "=== reel ==="
"$FF" -hide_banner -i render/PM_Reel.mp4 2>&1 | grep -E "Duration|Stream"
