// Load the Tadhar brand font (Almoni) for use in all compositions.
import { staticFile } from "remotion";

const almoni = new FontFace(
  "Almoni",
  `url(${staticFile("fonts/almoni-regular.otf")})`
);

almoni.load().then(() => {
  document.fonts.add(almoni);
});

export const FONT_FAMILY = "Almoni, sans-serif";
