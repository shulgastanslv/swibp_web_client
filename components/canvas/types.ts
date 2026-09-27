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
