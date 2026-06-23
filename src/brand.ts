// ── Tadhar brand tokens ──────────────────────────────────────────────────────
// Colors sampled from the Tadhar logo (deep green wordmark + the multi-color
// "building" mark). Exact hex values will be refined once the official logo
// file arrives; these are close matches for now.

export const BRAND = {
  green: "#0F4C3A", // primary deep green (the wordmark)
  greenDark: "#0A3328", // darker shade for backgrounds
  // The colored building blocks — used for icons, accents, kinetic titles:
  red: "#D63A4A",
  orange: "#F4A93C",
  pink: "#F2A9BC",
  leaf: "#4FA47C",
  teal: "#14534A",
  blue: "#8FC3E8",
  // Neutrals
  cream: "#F5F3EC",
  ink: "#10221C",
  white: "#FFFFFF",
} as const;

// Accent rotation used for kinetic titles / icon strokes across scenes.
export const ACCENTS = [
  BRAND.red,
  BRAND.orange,
  BRAND.leaf,
  BRAND.blue,
  BRAND.pink,
] as const;
