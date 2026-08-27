import React from "react";
import { Freeze } from "remotion";
import { Outro } from "./Outro";
import type { TitleCardProps } from "./schema";

/** The frame the outro has fully settled on. */
const SETTLED_FRAME = 90;

/**
 * The still version of the outro: the same scene, frozen once everything has
 * animated in. Rendering it through <Outro /> keeps the two in step.
 */
export const TitleCard: React.FC<TitleCardProps> = (props) => (
  <Freeze frame={SETTLED_FRAME}>
    <Outro {...props} />
  </Freeze>
);
