/** Catalog of free Iconify collections + unDraw illustrations tab. */

export type IconTabId = "icons" | "color" | "emoji" | "undraw";

export interface IconCollectionTab {
  id: IconTabId;
  label: string;
  /** Iconify prefixes — empty for undraw */
  prefixes: string;
  description: string;
}

export interface IconCategory {
  id: string;
  label: string;
  query: string;
}

export interface IconItem {
  id: string;
  name: string;
  /** Direct CDN URL for unDraw previews / fetch */
  media?: string;
  kind?: "iconify" | "undraw";
}

export const ICON_TABS: IconCollectionTab[] = [
  {
    id: "icons",
    label: "Иконки",
    prefixes: "mdi,tabler,bi,ri,carbon",
    description: "Контурные и залитые",
  },
  {
    id: "color",
    label: "Цвет",
    prefixes: "flat-color-icons,vscode-icons,skill-icons",
    description: "Цветные пиктограммы",
  },
  {
    id: "emoji",
    label: "Эмодзи",
    prefixes: "fluent-emoji-flat,noto,twemoji",
    description: "Эмодзи",
  },
  {
    id: "undraw",
    label: "Иллюстрации",
    prefixes: "",
    description: "Иллюстрации unDraw",
  },
];

export const ICON_CATEGORIES: IconCategory[] = [
  { id: "popular", label: "Топ", query: "star" },
  { id: "arrows", label: "Стрелки", query: "arrow" },
  { id: "business", label: "Бизнес", query: "chart" },
  { id: "people", label: "Люди", query: "user" },
  { id: "social", label: "Соцсети", query: "share" },
  { id: "tech", label: "Tech", query: "code" },
];

export const UNDRAW_CATEGORIES: IconCategory[] = [
  { id: "team", label: "Команда", query: "team" },
  { id: "business", label: "Бизнес", query: "business" },
  { id: "coding", label: "Код", query: "coding" },
  { id: "design", label: "Дизайн", query: "design" },
  { id: "work", label: "Работа", query: "work" },
  { id: "mobile", label: "Mobile", query: "mobile" },
  { id: "marketing", label: "Маркетинг", query: "marketing" },
  { id: "shopping", label: "Шоппинг", query: "shopping" },
  { id: "success", label: "Успех", query: "success" },
  { id: "empty", label: "Empty", query: "empty" },
];

export const DEFAULT_ICONS: IconItem[] = [
  { id: "mdi:rocket-launch", name: "rocket" },
  { id: "mdi:fire", name: "fire" },
  { id: "mdi:star", name: "star" },
  { id: "mdi:heart", name: "heart" },
  { id: "mdi:chart-line", name: "chart" },
  { id: "mdi:lightbulb-on", name: "idea" },
  { id: "mdi:message-text", name: "chat" },
  { id: "mdi:check-circle", name: "check" },
  { id: "tabler:sparkles", name: "sparkles" },
  { id: "tabler:target", name: "target" },
  { id: "bi:lightning-charge-fill", name: "bolt" },
  { id: "ri:trophy-fill", name: "trophy" },
];

export const DEFAULT_COLOR_ICONS: IconItem[] = [
  { id: "flat-color-icons:rocket", name: "rocket" },
  { id: "flat-color-icons:idea", name: "idea" },
  { id: "flat-color-icons:like", name: "like" },
  { id: "flat-color-icons:star", name: "star" },
  { id: "flat-color-icons:sales-performance", name: "sales" },
  { id: "flat-color-icons:diploma-1", name: "diploma" },
  { id: "flat-color-icons:advertising", name: "ads" },
  { id: "flat-color-icons:shop", name: "shop" },
];

export const DEFAULT_EMOJI: IconItem[] = [
  { id: "fluent-emoji-flat:rocket", name: "rocket" },
  { id: "fluent-emoji-flat:fire", name: "fire" },
  { id: "fluent-emoji-flat:star", name: "star" },
  { id: "fluent-emoji-flat:glowing-star", name: "glow" },
  { id: "fluent-emoji-flat:party-popper", name: "party" },
  { id: "fluent-emoji-flat:light-bulb", name: "idea" },
  { id: "fluent-emoji-flat:chart-increasing", name: "chart" },
  { id: "fluent-emoji-flat:thumbs-up", name: "like" },
];

/** Seed undraw list before first search resolves (media from CDN). */
export const DEFAULT_UNDRAW: IconItem[] = [
  {
    id: "undraw:team_mmq0",
    name: "Team",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/team_mmq0.svg",
  },
  {
    id: "undraw:teamwork_zplp",
    name: "Teamwork",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/teamwork_zplp.svg",
  },
  {
    id: "undraw:business-pitch_h9yw",
    name: "Business Pitch",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/business-pitch_h9yw.svg",
  },
  {
    id: "undraw:business-plan_zrf7",
    name: "Business Plan",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/business-plan_zrf7.svg",
  },
  {
    id: "undraw:coding_joxb",
    name: "Coding",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/coding_joxb.svg",
  },
  {
    id: "undraw:vibe-coding_mjme",
    name: "Vibe coding",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/vibe-coding_mjme.svg",
  },
  {
    id: "undraw:programmer_raqr",
    name: "Programmer",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/programmer_raqr.svg",
  },
  {
    id: "undraw:design_ewba",
    name: "Design",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/design_ewba.svg",
  },
  {
    id: "undraw:design-components_c2hs",
    name: "Design Components",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/design-components_c2hs.svg",
  },
  {
    id: "undraw:working-at-home_usrj",
    name: "Working at Home",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/working-at-home_usrj.svg",
  },
  {
    id: "undraw:mobile-app_aftb",
    name: "Mobile app",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/mobile-app_aftb.svg",
  },
  {
    id: "undraw:marketing-analysis_2u5r",
    name: "Marketing Analysis",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/marketing-analysis_2u5r.svg",
  },
  {
    id: "undraw:successful_rtc4",
    name: "Successful",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/successful_rtc4.svg",
  },
  {
    id: "undraw:success_288d",
    name: "Success",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/success_288d.svg",
  },
  {
    id: "undraw:shopping-favorites_spd0",
    name: "Shopping Favorites",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/shopping-favorites_spd0.svg",
  },
  {
    id: "undraw:web-shopping_xd5k",
    name: "Web Shopping",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/web-shopping_xd5k.svg",
  },
  {
    id: "undraw:empty-mailbox_ef0e",
    name: "Empty Mailbox",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/empty-mailbox_ef0e.svg",
  },
  {
    id: "undraw:the-void_i26b",
    name: "The Void",
    kind: "undraw",
    media: "https://cdn.undraw.co/illustration/the-void_i26b.svg",
  },
];

export function defaultsForTab(tab: IconTabId): IconItem[] {
  if (tab === "color") return DEFAULT_COLOR_ICONS;
  if (tab === "emoji") return DEFAULT_EMOJI;
  if (tab === "undraw") return DEFAULT_UNDRAW;
  return DEFAULT_ICONS;
}

export function categoriesForTab(tab: IconTabId): IconCategory[] {
  if (tab === "undraw") return UNDRAW_CATEGORIES;
  return ICON_CATEGORIES;
}

export function tabById(id: IconTabId): IconCollectionTab {
  return ICON_TABS.find((t) => t.id === id) ?? ICON_TABS[0];
}

export function displayName(iconId: string, fallback?: string): string {
  if (fallback) return fallback;
  const name = iconId.split(":")[1] ?? iconId;
  return name.replace(/-/g, " ");
}
