import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  segments,
  OPENING_SECONDS,
  CLOSING_SECONDS,
  TRANSITION_SECONDS,
  MUTE_CLIPS,
  NARRATION,
  MUSIC_INTRO,
  MUSIC_BODY,
  MUSIC_DUCK,
  MUSIC_OPEN,
} from "./edit";
import { Opening } from "./Opening";
import { Closing } from "./Closing";
import { Title } from "./Title";
import { FreezeScene } from "./FreezeScene";

export const MainVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const transitionFrames = Math.round(TRANSITION_SECONDS * fps);
  const openingFrames = Math.round(OPENING_SECONDS * fps);

  // Scene 1 begins right after the opening card (the transition overlaps it).
  const narrationStart = Math.max(0, openingFrames - transitionFrames);
  const freezeFrames = Math.round(0.85 * fps);

  // Walk the timeline (opening + segments + closing) to find absolute frames.
  // A cross-fade overlaps consecutive items, except after a freeze (hard cut).
  const children = [
    { dur: openingFrames, freeze: false },
    ...segments.map((s) => ({ dur: Math.round(s.durationSeconds * fps), freeze: !!s.freeze })),
    { dur: Math.round(CLOSING_SECONDS * fps), freeze: false },
  ];
  const starts: number[] = [];
  let cur = 0;
  for (let i = 0; i < children.length; i++) {
    starts.push(cur);
    const hasTransitionAfter = i < children.length - 1 && !children[i].freeze;
    cur += children[i].dur - (hasTransitionAfter ? transitionFrames : 0);
  }
  const totalFrames = starts[children.length - 1] + children[children.length - 1].dur;

  // The freeze segment's end = where the music switches (First Date → Up).
  const freezeIdx = segments.findIndex((s) => s.freeze);
  const freezeChild = freezeIdx >= 0 ? freezeIdx + 1 : 1;
  const freezeEnd = starts[freezeChild] + children[freezeChild].dur;
  const freezeStart = freezeEnd - freezeFrames;

  // First Date: loud intro → duck under narration → cut at the freeze.
  const introVol = (f: number) =>
    interpolate(
      f,
      [0, narrationStart - 8, narrationStart + 12, freezeStart - 16, freezeStart],
      [MUSIC_OPEN, MUSIC_OPEN, MUSIC_DUCK, MUSIC_DUCK, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Up: fade in after the freeze, ducked, fade out at the very end.
  const upLen = totalFrames - freezeEnd;
  const bodyVol = (f: number) =>
    interpolate(
      f,
      [0, 14, upLen - 40, upLen],
      [0, MUSIC_DUCK, MUSIC_DUCK, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Presenter (דר) windows: there we hear the CLIP's own audio, so the master
  // narration is muted across those absolute-frame ranges.
  const presenterWindows: Array<[number, number]> = segments
    .map((s, i) => (s.presenter ? ([starts[i + 1], starts[i + 1] + children[i + 1].dur] as [number, number]) : null))
    .filter((w): w is [number, number] => w !== null);

  // narration volume — receives frame relative to its Sequence (narrationStart)
  const narrationVol = (f: number): number => {
    const abs = f + narrationStart;
    const inPresenter = presenterWindows.some(([s, e]) => abs >= s - 3 && abs < e + 3);
    return inPresenter ? 0 : 1;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {/* Opening title card */}
        <TransitionSeries.Sequence durationInFrames={openingFrames}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionFrames })}
        />

        {segments.map((seg, i) => {
          const dur = Math.round(seg.durationSeconds * fps);
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={dur}>
                <AbsoluteFill style={{ backgroundColor: "black" }}>
                  {seg.freeze ? (
                    <FreezeScene
                      src={staticFile(seg.clip)}
                      durationInFrames={dur}
                      muted={MUTE_CLIPS}
                    />
                  ) : (
                    <OffthreadVideo
                      src={staticFile(seg.clip)}
                      // presenter clips keep their own audio (lip-sync); B-roll muted
                      muted={MUTE_CLIPS && !seg.presenter}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  {seg.title ? (
                    <Title data={seg.title} sceneDurationFrames={dur} />
                  ) : null}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              {/* hard cut right after the freeze ("TV unsticks"); else cross-fade */}
              {seg.freeze ? null : (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Closing logo card */}
        <TransitionSeries.Sequence durationInFrames={Math.round(CLOSING_SECONDS * fps)}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Master narration — continuous, but muted under presenter (דר) clips
          so we hear the presenter's own lip-synced audio there */}
      <Sequence from={narrationStart}>
        <Audio src={staticFile(NARRATION)} volume={narrationVol} />
      </Sequence>

      {/* Background music: First Date (intro) cuts at the freeze, Up takes over */}
      <Audio src={staticFile(MUSIC_INTRO)} volume={introVol} />
      <Sequence from={freezeEnd}>
        <Audio src={staticFile(MUSIC_BODY)} volume={bodyVol} />
      </Sequence>
    </AbsoluteFill>
  );
};
