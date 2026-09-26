export interface CanvasElement {
  id: string;
  type:
    | "heading"
    | "subtitle"
    | "paragraph"
    | "rect"
    | "circle"
    | "triangle"
    | "star"
    | "divider"
    | "quote"
    | "code"
    | "tag"
    | "swipe"
    | "cta"
    | "badge"
    | "handle"
    | "image";
  content: string;
  x: number;
  y: number;
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  align: "left" | "center" | "right" | "justify";
  badgeText: string;
  elements: CanvasElement[];
}

export const initialSlides: SlideData[] = [
  {
    id: 1,
    title: "Boost Your Reach",
    subtitle: "A minimal carousel template for modern content creators.",
    align: "left",
    badgeText: "SWIPE ➔",
    elements: [
      { id: "e1", type: "handle", content: "@username", x: 10, y: 88 },
      { id: "e2", type: "tag", content: "DESIGN TIPS", x: 10, y: 15 },
    ],
  },
  {
    id: 2,
    title: "Step 01: The Hook",
    subtitle: "Grab immediate attention within the first 0.5 seconds.",
    align: "left",
    badgeText: "01/04",
    elements: [
      {
        id: "e3",
        type: "quote",
        content: "First impressions are everything.",
        x: 10,
        y: 65,
      },
    ],
  },
  {
    id: 3,
    title: "Step 02: High Value",
    subtitle: "Deliver concrete insights, clean data, or actionable tips.",
    align: "left",
    badgeText: "02/04",
    elements: [{ id: "e4", type: "star", content: "5.0 Rating", x: 10, y: 70 }],
  },
  {
    id: 4,
    title: "Call To Action",
    subtitle: "Save this post and share it with your network!",
    align: "center",
    badgeText: "SAVE IT",
    elements: [
      { id: "e5", type: "cta", content: "Follow for More", x: 25, y: 75 },
    ],
  },
];

export const templatePresets = [
  {
    id: 1,
    name: "Список / Материалы",
    badge: "LIST 📋",
    previewBg: "bg-zinc-100 dark:bg-zinc-800/80",
    accent: "bg-zinc-900 dark:bg-zinc-100",
  },
  {
    id: 2,
    name: "До / После",
    badge: "VS ⚡️",
    previewBg: "bg-zinc-200/60 dark:bg-zinc-800",
    accent: "bg-indigo-600",
  },
  {
    id: 3,
    name: "Картинки / Визуал",
    badge: "IMAGE 🖼️",
    previewBg: "bg-blue-50/50 dark:bg-blue-950/30",
    accent: "bg-blue-600",
  },
  {
    id: 4,
    name: "Цитата / Мысль",
    badge: "QUOTE 💬",
    previewBg: "bg-amber-50/50 dark:bg-amber-950/30",
    accent: "bg-amber-500",
  },
  {
    id: 5,
    name: "Шаг / Инструкция (1-2-3)",
    badge: "STEP 01",
    previewBg: "bg-emerald-50/50 dark:bg-emerald-950/30",
    accent: "bg-emerald-600",
  },
  {
    id: 6,
    name: "Цифра / Метрика",
    badge: "STAT 📊",
    previewBg: "bg-lime-50/50 dark:bg-lime-950/30",
    accent: "bg-lime-600",
  },
  {
    id: 7,
    name: "Код / Тех. решение",
    badge: "CODE 💻",
    previewBg: "bg-zinc-900 text-zinc-100",
    accent: "bg-emerald-400",
  },
  {
    id: 8,
    name: "Предупреждение / Миф",
    badge: "WARNING ⚠️",
    previewBg: "bg-red-50/50 dark:bg-red-950/30",
    accent: "bg-red-600",
  },
  {
    id: 9,
    name: "Подборка софта / Стэк",
    badge: "STACK 📦",
    previewBg: "bg-purple-50/50 dark:bg-purple-950/30",
    accent: "bg-purple-600",
  },
  {
    id: 10,
    name: "Финал / Призыв (CTA)",
    badge: "SAVE IT 📌",
    previewBg: "bg-primary/10",
    accent: "bg-primary",
  },
];
