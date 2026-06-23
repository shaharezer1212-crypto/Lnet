// ── Tadhar brand tokens ──────────────────────────────────────────────────────
// Colors sampled directly from the official Tadhar logo (public/logo/).

export const BRAND = {
  green: "#0A4438", // primary deep green (the wordmark)
  greenDark: "#06302A", // darker shade for backgrounds
  teal: "#0F514D", // dark teal building face
  // The colored "building" blocks — used for icons, accents, kinetic titles:
  red: "#E53E52",
  orange: "#F2A93C",
  pink: "#F7A3B3",
  leaf: "#459361",
  blue: "#89B7E8",
  // Neutrals
  cream: "#F5F3EC",
  ink: "#0A201B",
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
