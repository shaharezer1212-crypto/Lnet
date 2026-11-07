#!/bin/sh
# music + foley mix, -15 LUFS. usage: sh mix.sh out.wav total_seconds
set -e
T=$2
EV_OLD="pencil.wav:0.0:0.6 steps.wav:1.1:0.55 pencil.wav:6.27:0.45 flutter.wav:8.3:0.3 click.wav:9.85:0.9 pencil.wav:13.13:0.45 pages.wav:14.0:0.6 pencil.wav:17.4:0.45 pops.wav:18.5:0.45 pencil.wav:21.67:0.45 clap.wav:23.65:0.9 pencil.wav:25.93:0.6 flutter.wav:27.8:0.3 pencil.wav:30.33:0.55 pops.wav:30.7:0.45"
EV="pops.wav:0.15:0.35 flutter.wav:0.5:0.25 pops.wav:2.05:0.35 pops.wav:4.15:0.35 click.wav:5.0:0.6 pencil.wav:6.0:0.6 steps.wav:6.9:0.55 pencil.wav:10.87:0.45 flutter.wav:12.9:0.3 click.wav:14.35:0.9 pencil.wav:16.33:0.45 pages.wav:17.2:0.6 pencil.wav:20.4:0.45 pops.wav:21.4:0.45 pencil.wav:24.47:0.45 click.wav:25.5:0.5 pops.wav:27.2:0.4 pencil.wav:28.53:0.6 flutter.wav:30.6:0.3 pencil.wav:32.53:0.55 pops.wav:32.9:0.45"
IN="-i music3.mp3"; F="[0:a]atrim=0:$T,volume='if(between(t,13.8,14.35),0.25,if(between(t,27.9,28.6),0.15,1))':eval=frame,afade=t=out:st=$(echo "$T-1.3"|bc):d=1.3,volume=0.55[m];"; i=1; L="[m]"
for e in $EV; do f=${e%%:*}; r=${e#*:}; s=${r%%:*}; v=${r#*:}; IN="$IN -i sfx/$f"; ms=$(echo "$s*1000/1"|bc); F="$F[$i:a]adelay=$ms|$ms,volume=$v[s$i];"; L="$L[s$i]"; i=$((i+1)); done
ffmpeg -v error -y $IN -filter_complex "$F${L}amix=inputs=$i:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5,atrim=0:$T" -ar 48000 -ac 2 $1
