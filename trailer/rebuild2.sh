#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo ">> topics"; node renderscene.mjs scenes/scene_topics.html 10.3 topics 30
echo ">> features"; bash build_features.sh
echo ">> final"; bash build_final.sh
echo "REBUILD2_DONE"
