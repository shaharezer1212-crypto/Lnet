import {loadFont} from '@remotion/google-fonts/Poppins';

// Clean modern interim font. Swap to the official ZIM font once provided
// (drop the .ttf/.otf in public/fonts and load it via @font-face here).
const {fontFamily} = loadFont('normal', {weights: ['400', '600', '700', '800', '900']});

export const FONT = fontFamily;

// KudoZ / ZIM brand palette used across the motion-graphics beats.
export const COLORS = {
  zimBlue: '#0A3D91',
  zimBlueDeep: '#06245A',
  sky: '#2E8FE6',
  ink: '#0B1B3A',
  paper: '#F4F8FF',
  // KudoZ playful accents
  pink: '#E5267E',
  yellow: '#FFC42E',
  green: '#23B26D',
  purple: '#7A4FE0',
  orange: '#FF7A1A',
};
