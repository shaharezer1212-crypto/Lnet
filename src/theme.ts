import {staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Official ZIM font — Magistral.
const FAMILY = 'Magistral';
loadFont({
  family: FAMILY,
  url: staticFile('fonts/Magistral-Medium.otf'),
  weight: '500',
}).catch(() => {});

export const FONT = `"${FAMILY}", Arial, sans-serif`;

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
