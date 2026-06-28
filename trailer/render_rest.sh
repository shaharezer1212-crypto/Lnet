#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
node renderscene.mjs scenes/scene_reveal.html 7.0 reveal 30
node renderscene.mjs scenes/scene_topics.html 10.3 topics 30
node renderscene.mjs scenes/scene_why.html 7.9 why 30
node renderscene.mjs scenes/scene_cta.html 3.27 cta 30
bash build_features.sh
echo "ALL_RENDERS_DONE"
