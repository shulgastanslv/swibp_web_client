export interface SolidPreset {
  type: "solid";
  color: string;
}

export interface GradientPreset {
  type: "gradient";
  colors: [string, string];
}

export interface SuggestedSet {
  id: string;
  label: string;
  background: string;
  text: string;
  accent: string;
  card: string;
}

/**
 * Neutrals first, then soft pastels.
 * Pastels stay high-lightness and low-saturation: blush, cream, sage, ice, lilac.
 */
export const SOLID_PRESETS: SolidPreset[] = [
  { type: "solid", color: "#000000" },
  { type: "solid", color: "#0a0a0a" },
  { type: "solid", color: "#111111" },
  { type: "solid", color: "#121212" },
  { type: "solid", color: "#1a1a1a" },
  { type: "solid", color: "#252525" },
  { type: "solid", color: "#303030" },
  { type: "solid", color: "#3d3d3d" },
  { type: "solid", color: "#4a4a4a" },
  { type: "solid", color: "#5a5a5a" },
  { type: "solid", color: "#6b6b6b" },
  { type: "solid", color: "#808080" },
  { type: "solid", color: "#999999" },
  { type: "solid", color: "#b0b0b0" },
  { type: "solid", color: "#c4c4c4" },
  { type: "solid", color: "#d4d4d4" },
  { type: "solid", color: "#e0e0e0" },
  { type: "solid", color: "#e8e8e8" },
  { type: "solid", color: "#f0f0f0" },
  { type: "solid", color: "#f1f1f1" },
  { type: "solid", color: "#f5f5f5" },
  { type: "solid", color: "#f9f9f9" },
  { type: "solid", color: "#ffffff" },
  // Soft pastels, lightest to a little deeper. Eight hues across each row.
  { type: "solid", color: "#fbf6f6" },
  { type: "solid", color: "#fbf5f0" },
  { type: "solid", color: "#fbf7f0" },
  { type: "solid", color: "#f5f7f4" },
  { type: "solid", color: "#f3f7f7" },
  { type: "solid", color: "#f4f5f9" },
  { type: "solid", color: "#f6f5f9" },
  { type: "solid", color: "#f9f5f7" },
  { type: "solid", color: "#f7e8e8" },
  { type: "solid", color: "#f7e9dc" },
  { type: "solid", color: "#f6edd6" },
  { type: "solid", color: "#e7f0e6" },
  { type: "solid", color: "#dff0ef" },
  { type: "solid", color: "#e6e8f6" },
  { type: "solid", color: "#ece6f4" },
  { type: "solid", color: "#f3e6ee" },
  { type: "solid", color: "#f0d6d6" },
  { type: "solid", color: "#f0d8c6" },
  { type: "solid", color: "#edd9b8" },
  { type: "solid", color: "#d5e6d4" },
  { type: "solid", color: "#cce6e4" },
  { type: "solid", color: "#d4d6ee" },
  { type: "solid", color: "#e0d4ec" },
  { type: "solid", color: "#ebcfe0" },
  { type: "solid", color: "#e6c4c4" },
  { type: "solid", color: "#e6c8b2" },
  { type: "solid", color: "#e2cc9e" },
  { type: "solid", color: "#c4d8c4" },
  { type: "solid", color: "#b8d8d6" },
  { type: "solid", color: "#c4c6e4" },
  { type: "solid", color: "#d2c2e0" },
  { type: "solid", color: "#e0bcd2" },
  { type: "solid", color: "#dcb4b4" },
  { type: "solid", color: "#dcb8a4" },
  { type: "solid", color: "#d6bc90" },
  { type: "solid", color: "#b4ccb4" },
  { type: "solid", color: "#a8cccc" },
  { type: "solid", color: "#b4b6d8" },
  { type: "solid", color: "#c4b0d0" },
  { type: "solid", color: "#d4aac4" },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  { type: "gradient", colors: ["#000000", "#121212"] },
  { type: "gradient", colors: ["#0a0a0a", "#1a1a1a"] },
  { type: "gradient", colors: ["#111111", "#252525"] },
  { type: "gradient", colors: ["#121212", "#2a2a2a"] },
  { type: "gradient", colors: ["#1a1a1a", "#333333"] },
  { type: "gradient", colors: ["#252525", "#3a3a3a"] },
  { type: "gradient", colors: ["#2a2a2a", "#404040"] },
  { type: "gradient", colors: ["#333333", "#4a4a4a"] },
  { type: "gradient", colors: ["#ffffff", "#f1f1f1"] },
  { type: "gradient", colors: ["#fafafa", "#e8e8e8"] },
  { type: "gradient", colors: ["#f9f9f9", "#e0e0e0"] },
  { type: "gradient", colors: ["#f5f5f5", "#d4d4d4"] },
  { type: "gradient", colors: ["#ffffff", "#d9d9d9"] },
  { type: "gradient", colors: ["#f1f1f1", "#c8c8c8"] },
  { type: "gradient", colors: ["#e5e5e5", "#ffffff"] },
  { type: "gradient", colors: ["#181818", "#303030"] },
  { type: "gradient", colors: ["#fbf6f6", "#f0d6d6"] },
  { type: "gradient", colors: ["#fbf5f0", "#f0d8c6"] },
  { type: "gradient", colors: ["#fbf7f0", "#edd9b8"] },
  { type: "gradient", colors: ["#f5f7f4", "#d5e6d4"] },
  { type: "gradient", colors: ["#f3f7f7", "#cce6e4"] },
  { type: "gradient", colors: ["#f4f5f9", "#d4d6ee"] },
  { type: "gradient", colors: ["#f6f5f9", "#e0d4ec"] },
  { type: "gradient", colors: ["#f9f5f7", "#ebcfe0"] },
];

/** Full carousel palettes that stay inside the same neutral range. */
export const SUGGESTED_SETS: SuggestedSet[] = [
  {
    id: "white",
    label: "White",
    background: "#ffffff",
    text: "#121212",
    accent: "#3a3a3a",
    card: "#f5f5f5",
  },
  {
    id: "paper",
    label: "Paper",
    background: "#f9f9f9",
    text: "#1a1a1a",
    accent: "#454545",
    card: "#ffffff",
  },
  {
    id: "mist",
    label: "Mist",
    background: "#f1f1f1",
    text: "#171717",
    accent: "#333333",
    card: "#fafafa",
  },
  {
    id: "stone",
    label: "Stone",
    background: "#e5e5e5",
    text: "#111111",
    accent: "#2a2a2a",
    card: "#f7f7f7",
  },
  {
    id: "graphite",
    label: "Graphite",
    background: "#252525",
    text: "#f1f1f1",
    accent: "#d4d4d4",
    card: "#333333",
  },
  {
    id: "ink",
    label: "Ink",
    background: "#121212",
    text: "#f5f5f5",
    accent: "#c8c8c8",
    card: "#1e1e1e",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    background: "#1a1a1a",
    text: "#eeeeee",
    accent: "#bdbdbd",
    card: "#2c2c2c",
  },
  {
    id: "black",
    label: "Black",
    background: "#000000",
    text: "#fafafa",
    accent: "#e5e5e5",
    card: "#141414",
  },
  {
    id: "blush",
    label: "Blush",
    background: "#f7e8e8",
    text: "#2a2222",
    accent: "#c4a0a0",
    card: "#fbf6f6",
  },
  {
    id: "peach",
    label: "Peach",
    background: "#f7e9dc",
    text: "#2a241c",
    accent: "#c4aa90",
    card: "#fbf5f0",
  },
  {
    id: "cream",
    label: "Cream",
    background: "#f6edd6",
    text: "#262218",
    accent: "#b8a888",
    card: "#fbf7f0",
  },
  {
    id: "sage",
    label: "Sage",
    background: "#e7f0e6",
    text: "#1c2620",
    accent: "#8eaa94",
    card: "#f5f7f4",
  },
  {
    id: "ice",
    label: "Ice",
    background: "#dff0ef",
    text: "#1a2426",
    accent: "#88a8a8",
    card: "#f3f7f7",
  },
  {
    id: "lilac",
    label: "Lilac",
    background: "#ece6f4",
    text: "#221e28",
    accent: "#a498b4",
    card: "#f6f5f9",
  },
];
