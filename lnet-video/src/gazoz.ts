import { loadFont } from "@remotion/fonts";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

/**
 * FB Gazoz is a Hebrew-only face (no Latin letters), so anything written in
 * Latin falls back to the stack below.
 */
export const GAZOZ_FAMILY = "Fb Gazoz";
export const gazozFontStack = `"${GAZOZ_FAMILY}", "Heebo", sans-serif`;

const handle = delayRender("Loading the FB Gazoz font");

loadFont({
  family: GAZOZ_FAMILY,
  url: staticFile("fonts/FbGazozRegular.otf"),
  format: "opentype",
})
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
