#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo ">> rendering scenes"
node renderscene.mjs scenes/scene_open.html   14   open   30
node renderscene.mjs scenes/scene_reveal.html 7.0  reveal 30
node renderscene.mjs scenes/scene_topics.html 10.3 topics 30
node renderscene.mjs scenes/scene_why.html    7.9  why    30
node renderscene.mjs scenes/scene_cta.html    3.27 cta    30
echo ">> building features (clips + animated overlay)"
bash build_features.sh
echo ">> mixing audio"
bash build_mix.sh
echo ">> final assembly"
bash build_final.sh
echo "BUILD_ALL_DONE"
