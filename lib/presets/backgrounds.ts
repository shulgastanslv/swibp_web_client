export interface SolidPreset {
  type: "solid";
  color: string;
}

export interface GradientPreset {
  type: "gradient";
  colors: [string, string];
}

export const SOLID_PRESETS: SolidPreset[] = [
  // Neutrals
  { type: "solid", color: "#000000" },
  { type: "solid", color: "#0a0a0a" },
  { type: "solid", color: "#171717" },
  { type: "solid", color: "#262626" },
  { type: "solid", color: "#404040" },
  { type: "solid", color: "#737373" },
  { type: "solid", color: "#a3a3a3" },
  { type: "solid", color: "#d4d4d4" },
  { type: "solid", color: "#e5e5e5" },
  { type: "solid", color: "#f5f5f5" },
  { type: "solid", color: "#fafafa" },
  { type: "solid", color: "#ffffff" },
  // Warm
  { type: "solid", color: "#1c1917" },
  { type: "solid", color: "#292524" },
  { type: "solid", color: "#44403c" },
  { type: "solid", color: "#78716c" },
  { type: "solid", color: "#a8a29e" },
  { type: "solid", color: "#d6d3d1" },
  { type: "solid", color: "#e7e5e4" },
  { type: "solid", color: "#f5f5f4" },
  { type: "solid", color: "#fafaf9" },
  { type: "solid", color: "#faf5f0" },
  { type: "solid", color: "#f5ebe0" },
  { type: "solid", color: "#e8d5c4" },
  // Cool
  { type: "solid", color: "#0f172a" },
  { type: "solid", color: "#1e293b" },
  { type: "solid", color: "#334155" },
  { type: "solid", color: "#64748b" },
  { type: "solid", color: "#94a3b8" },
  { type: "solid", color: "#cbd5e1" },
  { type: "solid", color: "#e2e8f0" },
  { type: "solid", color: "#f1f5f9" },
  { type: "solid", color: "#f8fafc" },
  // Soft pastels
  { type: "solid", color: "#fef2f2" },
  { type: "solid", color: "#fff7ed" },
  { type: "solid", color: "#fffbeb" },
  { type: "solid", color: "#f0fdf4" },
  { type: "solid", color: "#ecfeff" },
  { type: "solid", color: "#eff6ff" },
  { type: "solid", color: "#f5f3ff" },
  { type: "solid", color: "#fdf4ff" },
  { type: "solid", color: "#fce7f3" },
  { type: "solid", color: "#ffedd5" },
  { type: "solid", color: "#dbeafe" },
  { type: "solid", color: "#dcfce7" },
  // Saturated
  { type: "solid", color: "#dc2626" },
  { type: "solid", color: "#ea580c" },
  { type: "solid", color: "#ca8a04" },
  { type: "solid", color: "#16a34a" },
  { type: "solid", color: "#0d9488" },
  { type: "solid", color: "#2563eb" },
  { type: "solid", color: "#4f46e5" },
  { type: "solid", color: "#7c3aed" },
  { type: "solid", color: "#db2777" },
  { type: "solid", color: "#e11d48" },
  // Deep
  { type: "solid", color: "#7f1d1d" },
  { type: "solid", color: "#9a3412" },
  { type: "solid", color: "#14532d" },
  { type: "solid", color: "#134e4a" },
  { type: "solid", color: "#1e3a5f" },
  { type: "solid", color: "#312e81" },
  { type: "solid", color: "#4c1d95" },
  { type: "solid", color: "#831843" },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  // Dark
  { type: "gradient", colors: ["#000000", "#1a1a1a"] },
  { type: "gradient", colors: ["#0a0a0a", "#1e1e2e"] },
  { type: "gradient", colors: ["#0f172a", "#1e293b"] },
  { type: "gradient", colors: ["#0f172a", "#1e3a5f"] },
  { type: "gradient", colors: ["#0f172a", "#1e1b4b"] },
  { type: "gradient", colors: ["#0f172a", "#134e4a"] },
  { type: "gradient", colors: ["#111111", "#3b0764"] },
  { type: "gradient", colors: ["#18181b", "#7f1d1d"] },
  { type: "gradient", colors: ["#1c1917", "#78350f"] },
  { type: "gradient", colors: ["#14532d", "#052e16"] },
  { type: "gradient", colors: ["#1e1b4b", "#312e81"] },
  { type: "gradient", colors: ["#831843", "#4a044e"] },
  // Steel
  { type: "gradient", colors: ["#1e293b", "#334155"] },
  { type: "gradient", colors: ["#334155", "#64748b"] },
  { type: "gradient", colors: ["#475569", "#0f172a"] },
  { type: "gradient", colors: ["#3f4a5c", "#1e293b"] },
  // Light
  { type: "gradient", colors: ["#ffffff", "#f1f5f9"] },
  { type: "gradient", colors: ["#f8fafc", "#e2e8f0"] },
  { type: "gradient", colors: ["#fafaf9", "#e7e5e4"] },
  { type: "gradient", colors: ["#faf5f0", "#e8d5c4"] },
  { type: "gradient", colors: ["#fffbf5", "#fde8cc"] },
  { type: "gradient", colors: ["#f8f7f4", "#ede9e0"] },
  // Soft color
  { type: "gradient", colors: ["#fef2f2", "#fecdd3"] },
  { type: "gradient", colors: ["#fff7ed", "#fed7aa"] },
  { type: "gradient", colors: ["#fffbeb", "#fde68a"] },
  { type: "gradient", colors: ["#f0fdf4", "#bbf7d0"] },
  { type: "gradient", colors: ["#ecfeff", "#a5f3fc"] },
  { type: "gradient", colors: ["#eff6ff", "#bfdbfe"] },
  { type: "gradient", colors: ["#f5f3ff", "#ddd6fe"] },
  { type: "gradient", colors: ["#fdf4ff", "#f5d0fe"] },
  { type: "gradient", colors: ["#fdf2f8", "#fbcfe8"] },
  // Bold
  { type: "gradient", colors: ["#2563eb", "#7c3aed"] },
  { type: "gradient", colors: ["#db2777", "#f59e0b"] },
  { type: "gradient", colors: ["#0d9488", "#2563eb"] },
  { type: "gradient", colors: ["#dc2626", "#ea580c"] },
  { type: "gradient", colors: ["#4f46e5", "#ec4899"] },
  { type: "gradient", colors: ["#059669", "#0ea5e9"] },
  { type: "gradient", colors: ["#7c3aed", "#2563eb"] },
  { type: "gradient", colors: ["#be185d", "#9f1239"] },
  // Warm → cool
  { type: "gradient", colors: ["#faf5eb", "#c8a96e"] },
  { type: "gradient", colors: ["#fef3c7", "#f97316"] },
  { type: "gradient", colors: ["#fee2e2", "#f43f5e"] },
  { type: "gradient", colors: ["#dbeafe", "#6366f1"] },
  { type: "gradient", colors: ["#dcfce7", "#14b8a6"] },
  { type: "gradient", colors: ["#ede9fe", "#8b5cf6"] },
  // Sunset / dusk
  { type: "gradient", colors: ["#1e1b4b", "#f97316"] },
  { type: "gradient", colors: ["#0c4a6e", "#fbbf24"] },
  { type: "gradient", colors: ["#4c1d95", "#ec4899"] },
  { type: "gradient", colors: ["#7f1d1d", "#fbbf24"] },
  { type: "gradient", colors: ["#134e4a", "#67e8f9"] },
];
