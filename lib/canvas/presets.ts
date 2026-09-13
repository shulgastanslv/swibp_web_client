import { BackgroundConfig } from "./types";

export const SOLID_PRESETS: BackgroundConfig[] = [
  // ===== Dark Neutrals (Тёмные нейтральные) =====
  { type: "solid", color: "#0a0a0a" },
  { type: "solid", color: "#111111" },
  { type: "solid", color: "#1a1a1a" },
  { type: "solid", color: "#1e1e1e" },
  { type: "solid", color: "#202020" },
  { type: "solid", color: "#2a2a2a" },
  { type: "solid", color: "#333333" },
  { type: "solid", color: "#404040" },

  // ===== Light Neutrals (Светлые нейтральные) =====
  { type: "solid", color: "#fafafa" },
  { type: "solid", color: "#f9f9f9" },
  { type: "solid", color: "#f5f5f5" },
  { type: "solid", color: "#f0f0f0" },
  { type: "solid", color: "#eaeaea" },
  { type: "solid", color: "#fefefe" },
  { type: "solid", color: "#ffffff" },
  { type: "solid", color: "#e5e5e5" },

  // ===== Warm Neutrals (Тёплые / бежевые / кремовые) =====
  { type: "solid", color: "#f5f1ea" },
  { type: "solid", color: "#ede4d3" },
  { type: "solid", color: "#e8dcc4" },
  { type: "solid", color: "#d9c7a7" },
  { type: "solid", color: "#c9b79c" },
  { type: "solid", color: "#b8a082" },

  // ===== Cool Grays (Холодные серые) =====
  { type: "solid", color: "#f4f6f8" },
  { type: "solid", color: "#e2e8f0" },
  { type: "solid", color: "#cbd5e1" },
  { type: "solid", color: "#94a3b8" },
  { type: "solid", color: "#64748b" },
  { type: "solid", color: "#334155" },

  // ===== Soft Pastels (Мягкие пастельные акценты) =====
  { type: "solid", color: "#fce7f3" }, // розовый пудровый
  { type: "solid", color: "#fde68a" }, // пастельный жёлтый
  { type: "solid", color: "#d1fae5" }, // мятный
  { type: "solid", color: "#dbeafe" }, // голубой
  { type: "solid", color: "#ede9fe" }, // лавандовый
  { type: "solid", color: "#ffedd5" }, // персиковый
];

export const GRADIENT_PRESETS: BackgroundConfig[] = [
  // ===== Dark Premium (Тёмные премиальные) =====
  { type: "gradient", colors: ["#0f0c29", "#302b63"] },
  { type: "gradient", colors: ["#000000", "#434343"] },
  { type: "gradient", colors: ["#141e30", "#243b55"] },
  { type: "gradient", colors: ["#1f1c2c", "#928dab"] },
  { type: "gradient", colors: ["#16222a", "#3a6073"] },
  { type: "gradient", colors: ["#200122", "#6f0000"] },
  { type: "gradient", colors: ["#0f2027", "#2c5364"] },
  { type: "gradient", colors: ["#232526", "#414345"] },
  { type: "gradient", colors: ["#1a2a6c", "#b21f1f"] },
  { type: "gradient", colors: ["#1e3c72", "#2a5298"] },

  { type: "gradient", colors: ["#ffecd2", "#fcb69f"] },
  { type: "gradient", colors: ["#ff9a9e", "#fecfef"] },
  { type: "gradient", colors: ["#a1c4fd", "#c2e9fb"] },
  { type: "gradient", colors: ["#fbc2eb", "#a6c1ee"] },
  { type: "gradient", colors: ["#fdcbf1", "#e6dee9"] },
  { type: "gradient", colors: ["#f6d365", "#fda085"] },
  { type: "gradient", colors: ["#e0c3fc", "#8ec5fc"] },
  { type: "gradient", colors: ["#ffefba", "#ffffff"] },
  { type: "gradient", colors: ["#fdfcfb", "#e2d1c3"] },
  { type: "gradient", colors: ["#f3e7e9", "#e3eeff"] },

  { type: "gradient", colors: ["#ff6e7f", "#bfe9ff"] },
  { type: "gradient", colors: ["#f12711", "#f5af19"] },
  { type: "gradient", colors: ["#ff512f", "#dd2476"] },
  { type: "gradient", colors: ["#fa709a", "#fee140"] },
  { type: "gradient", colors: ["#ff9966", "#ff5e62"] },
  { type: "gradient", colors: ["#f77062", "#fe5196"] },
  { type: "gradient", colors: ["#fc4a1a", "#f7b733"] },
  { type: "gradient", colors: ["#ee9ca7", "#ffdde1"] },
  { type: "gradient", colors: ["#ff7e5f", "#feb47b"] },
  { type: "gradient", colors: ["#ff5f6d", "#ffc371"] },

  // ===== Cool Ocean (Холодные океанические) =====
  { type: "gradient", colors: ["#4facfe", "#00f2fe"] },
  { type: "gradient", colors: ["#00c6fb", "#005bea"] },
  { type: "gradient", colors: ["#2193b0", "#6dd5ed"] },
  { type: "gradient", colors: ["#30cfd0", "#330867"] },
  { type: "gradient", colors: ["#0ba360", "#3cba92"] },
  { type: "gradient", colors: ["#00d2ff", "#3a7bd5"] },
  { type: "gradient", colors: ["#43cea2", "#185a9d"] },
  { type: "gradient", colors: ["#89f7fe", "#66a6ff"] },
  { type: "gradient", colors: ["#02aab0", "#00cdac"] },
  { type: "gradient", colors: ["#16a085", "#f4d03f"] },

  // ===== Vibrant Neon (Яркие неоновые) =====
  { type: "gradient", colors: ["#667eea", "#764ba2"] },
  { type: "gradient", colors: ["#f093fb", "#f5576c"] },
  { type: "gradient", colors: ["#b224ef", "#7579ff"] },
  { type: "gradient", colors: ["#ff758c", "#ff7eb3"] },
  { type: "gradient", colors: ["#a8ff78", "#78ffd6"] },
  { type: "gradient", colors: ["#ff00cc", "#333399"] },
  { type: "gradient", colors: ["#fc00ff", "#00dbde"] },
  { type: "gradient", colors: ["#8e2de2", "#4a00e0"] },
  { type: "gradient", colors: ["#ff416c", "#ff4b2b"] },
  { type: "gradient", colors: ["#c471f5", "#fa71cd"] },

  // ===== Neutral Minimal (Нейтральные минималистичные) =====
  { type: "gradient", colors: ["#ffffff", "#f5f5f5"] },
  { type: "gradient", colors: ["#f5f7fa", "#c3cfe2"] },
  { type: "gradient", colors: ["#e6e9f0", "#eef1f5"] },
  { type: "gradient", colors: ["#fdfbfb", "#ebedee"] },
  { type: "gradient", colors: ["#d7d2cc", "#304352"] },
  { type: "gradient", colors: ["#ece9e6", "#ffffff"] },
  { type: "gradient", colors: ["#bdc3c7", "#2c3e50"] },
  { type: "gradient", colors: ["#e0eaaf", "#cfdef3"] },

  // ===== Trendy 2024–2026 (Трендовые mesh/aurora) =====
  { type: "gradient", colors: ["#fbc7d4", "#9796f0"] },
  { type: "gradient", colors: ["#c2ffd8", "#465efb"] },
  { type: "gradient", colors: ["#ffafbd", "#ffc3a0"] },
  { type: "gradient", colors: ["#d299c2", "#fef9d7"] },
  { type: "gradient", colors: ["#89f7fe", "#66a6ff"] },
  { type: "gradient", colors: ["#fddb92", "#d1fdff"] },
  { type: "gradient", colors: ["#9890e3", "#b1f4cf"] },
  { type: "gradient", colors: ["#ebc0fd", "#d9ded8"] },
  { type: "gradient", colors: ["#96fbc4", "#f9f586"] },
  { type: "gradient", colors: ["#cd9cf2", "#f6f3ff"] },

  // ===== Deep Rich (Глубокие насыщенные) =====
  { type: "gradient", colors: ["#192bc2", "#be00cc"] },
  { type: "gradient", colors: ["#8e0e00", "#1f1c18"] },
  { type: "gradient", colors: ["#360033", "#0b8793"] },
  { type: "gradient", colors: ["#4568dc", "#b06ab3"] },
  { type: "gradient", colors: ["#0f0c29", "#302b63", "#24243e"] },
  { type: "gradient", colors: ["#283048", "#859398"] },
  { type: "gradient", colors: ["#3a1c71", "#d76d77", "#ffaf7b"] },
  { type: "gradient", colors: ["#cc2b5e", "#753a88"] },
  { type: "gradient", colors: ["#42275a", "#734b6d"] },
  { type: "gradient", colors: ["#5f2c82", "#49a09d"] },
];
