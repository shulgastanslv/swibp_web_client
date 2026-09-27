export interface SolidPreset {
  type: "solid";
  color: string;
}

export interface GradientPreset {
  type: "gradient";
  colors: [string, string];
  direction?: "linear" | "radial";
}

export type BackgroundPreset = SolidPreset | GradientPreset;

export const SOLID_PRESETS: SolidPreset[] = [
  // Near-blacks
  { type: "solid", color: "#0a0a0a" },
  { type: "solid", color: "#111111" },
  { type: "solid", color: "#1a1a1a" },
  { type: "solid", color: "#1e1e1e" },
  { type: "solid", color: "#202020" },
  { type: "solid", color: "#2a2a2a" },
  { type: "solid", color: "#333333" },
  { type: "solid", color: "#404040" },
  // Near-whites
  { type: "solid", color: "#ffffff" },
  { type: "solid", color: "#fafafa" },
  { type: "solid", color: "#f5f5f5" },
  { type: "solid", color: "#f0f0f0" },
  { type: "solid", color: "#eaeaea" },
  { type: "solid", color: "#e5e5e5" },
  // Warm neutrals
  { type: "solid", color: "#f5f1ea" },
  { type: "solid", color: "#ede4d3" },
  { type: "solid", color: "#e8dcc4" },
  { type: "solid", color: "#d9c7a7" },
  { type: "solid", color: "#c9b79c" },
  { type: "solid", color: "#b8a082" },
  // Cool neutrals
  { type: "solid", color: "#f4f6f8" },
  { type: "solid", color: "#e2e8f0" },
  { type: "solid", color: "#cbd5e1" },
  { type: "solid", color: "#94a3b8" },
  { type: "solid", color: "#64748b" },
  { type: "solid", color: "#334155" },
  { type: "solid", color: "#0f172a" },
  // Dark rich
  { type: "solid", color: "#1e3a5f" },
  { type: "solid", color: "#0c4a6e" },
  { type: "solid", color: "#14532d" },
  { type: "solid", color: "#4c1d95" },
  { type: "solid", color: "#831843" },
  { type: "solid", color: "#7f1d1d" },
  { type: "solid", color: "#78350f" },
  // Muted pastels
  { type: "solid", color: "#f0fdf4" },
  { type: "solid", color: "#fffbeb" },
  { type: "solid", color: "#fff1f2" },
  { type: "solid", color: "#f5f3ff" },
  { type: "solid", color: "#eff6ff" },
  { type: "solid", color: "#fdf4ff" },
  { type: "solid", color: "#f0f9ff" },
  { type: "solid", color: "#fff7ed" },
  // Muted mid-tones
  { type: "solid", color: "#fecdd3" },
  { type: "solid", color: "#ddd6fe" },
  { type: "solid", color: "#bae6fd" },
  { type: "solid", color: "#bbf7d0" },
  { type: "solid", color: "#fde68a" },
  { type: "solid", color: "#fed7aa" },
  // Accent solids
  { type: "solid", color: "#2563eb" },
  { type: "solid", color: "#7c3aed" },
  { type: "solid", color: "#db2777" },
  { type: "solid", color: "#0d9488" },
  { type: "solid", color: "#059669" },
  { type: "solid", color: "#dc2626" },
];

// 30 трендовых линейных градиентов 2026 — приглушённые, под карусели
export const GRADIENT_PRESETS: GradientPreset[] = [
  // Тёмные монохромные
  { type: "gradient", colors: ["#0a0a0a", "#1e1e2e"], direction: "linear" },
  { type: "gradient", colors: ["#111111", "#1a1a3a"], direction: "linear" },
  { type: "gradient", colors: ["#0f0f0f", "#1c1c1c"], direction: "linear" },
  // Тёмные с цветным акцентом
  { type: "gradient", colors: ["#0f172a", "#1e3a5f"], direction: "linear" },
  { type: "gradient", colors: ["#0f172a", "#1e1b4b"], direction: "linear" },
  { type: "gradient", colors: ["#0d1117", "#161b22"], direction: "linear" },
  { type: "gradient", colors: ["#13111c", "#1e1635"], direction: "linear" },
  { type: "gradient", colors: ["#0f172a", "#134e4a"], direction: "linear" },
  // Slate / Steel
  { type: "gradient", colors: ["#1e293b", "#334155"], direction: "linear" },
  { type: "gradient", colors: ["#1e293b", "#0f172a"], direction: "linear" },
  { type: "gradient", colors: ["#2d3748", "#1a202c"], direction: "linear" },
  // Пудровые светлые
  { type: "gradient", colors: ["#f8f7f4", "#ede9e0"], direction: "linear" },
  { type: "gradient", colors: ["#faf9f7", "#f0ebe2"], direction: "linear" },
  { type: "gradient", colors: ["#f4f6f8", "#e2e8f0"], direction: "linear" },
  { type: "gradient", colors: ["#f0f4ff", "#e0e7ff"], direction: "linear" },
  { type: "gradient", colors: ["#fdf2f8", "#fce7f3"], direction: "linear" },
  { type: "gradient", colors: ["#f0fdf4", "#dcfce7"], direction: "linear" },
  // Мягкие тёплые
  { type: "gradient", colors: ["#fffbf5", "#fde8cc"], direction: "linear" },
  { type: "gradient", colors: ["#fef9f0", "#fde8b4"], direction: "linear" },
  { type: "gradient", colors: ["#fdf6ec", "#f7dfc6"], direction: "linear" },
  // Матовые тёмно-цветные
  { type: "gradient", colors: ["#1a1a2e", "#16213e"], direction: "linear" },
  { type: "gradient", colors: ["#1c1f2e", "#2d1b69"], direction: "linear" },
  { type: "gradient", colors: ["#12131a", "#1e2d40"], direction: "linear" },
  // Переходы серый → цвет
  { type: "gradient", colors: ["#1e293b", "#312e81"], direction: "linear" },
  { type: "gradient", colors: ["#1e293b", "#064e3b"], direction: "linear" },
  { type: "gradient", colors: ["#1e293b", "#7c2d12"], direction: "linear" },
  // Нейтральные светло-серые
  { type: "gradient", colors: ["#ffffff", "#f1f5f9"], direction: "linear" },
  { type: "gradient", colors: ["#f8fafc", "#e2e8f0"], direction: "linear" },
  { type: "gradient", colors: ["#f1f5f9", "#cbd5e1"], direction: "linear" },
  // Кремово-тёплый в тёмный
  { type: "gradient", colors: ["#faf5eb", "#c8a96e"], direction: "linear" },
];

// 30 радиальных градиентов 2026 — глубина, glow-эффекты, мягкие виньетки
export const RADIAL_PRESETS: GradientPreset[] = [
  // Тёмные с тонким свечением
  { type: "gradient", colors: ["#1e2a3a", "#0a0a0a"], direction: "radial" },
  { type: "gradient", colors: ["#1e1b4b", "#080810"], direction: "radial" },
  { type: "gradient", colors: ["#1a2332", "#080c12"], direction: "radial" },
  { type: "gradient", colors: ["#16213e", "#0a0a0a"], direction: "radial" },
  { type: "gradient", colors: ["#1b1f3b", "#0d0d0d"], direction: "radial" },
  { type: "gradient", colors: ["#162032", "#090d14"], direction: "radial" },
  // Тёмно-зелёные / Slate-зелёные
  { type: "gradient", colors: ["#0f2419", "#050a07"], direction: "radial" },
  { type: "gradient", colors: ["#102a20", "#060f0a"], direction: "radial" },
  { type: "gradient", colors: ["#1a2e22", "#090f0c"], direction: "radial" },
  // Тёмно-фиолетовые
  { type: "gradient", colors: ["#1e1535", "#08050f"], direction: "radial" },
  { type: "gradient", colors: ["#201540", "#0a0615"], direction: "radial" },
  { type: "gradient", colors: ["#1a1030", "#07040e"], direction: "radial" },
  // Тёплые тёмные
  { type: "gradient", colors: ["#2a1a0e", "#0d0804"], direction: "radial" },
  { type: "gradient", colors: ["#291507", "#0e0704"], direction: "radial" },
  { type: "gradient", colors: ["#241610", "#0a0806"], direction: "radial" },
  // Светлые с мягким центром
  { type: "gradient", colors: ["#ffffff", "#e2e8f0"], direction: "radial" },
  { type: "gradient", colors: ["#fafafa", "#e8e4dc"], direction: "radial" },
  { type: "gradient", colors: ["#f8f7f4", "#ddd8ce"], direction: "radial" },
  // Пастельные radial
  { type: "gradient", colors: ["#f0f4ff", "#c7d2fe"], direction: "radial" },
  { type: "gradient", colors: ["#fdf2f8", "#f9a8d4"], direction: "radial" },
  { type: "gradient", colors: ["#f0fdf4", "#86efac"], direction: "radial" },
  // Нейтрально-серые
  { type: "gradient", colors: ["#334155", "#0f172a"], direction: "radial" },
  { type: "gradient", colors: ["#475569", "#1e293b"], direction: "radial" },
  { type: "gradient", colors: ["#3f4a5c", "#161e2d"], direction: "radial" },
  // Матово-коричневые
  { type: "gradient", colors: ["#3d2b1f", "#150e0a"], direction: "radial" },
  { type: "gradient", colors: ["#4a3728", "#1a1009"], direction: "radial" },
  // Steel blue radial
  { type: "gradient", colors: ["#1e3a5f", "#080f1a"], direction: "radial" },
  { type: "gradient", colors: ["#1e4060", "#070d15"], direction: "radial" },
  // Сине-стальные светлые
  { type: "gradient", colors: ["#dbeafe", "#93c5fd"], direction: "radial" },
  { type: "gradient", colors: ["#ede9fe", "#c4b5fd"], direction: "radial" },
  // Кремово-персиковый
  { type: "gradient", colors: ["#fff7ed", "#fed7aa"], direction: "radial" },
];
