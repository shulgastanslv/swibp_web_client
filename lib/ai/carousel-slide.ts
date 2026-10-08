import {
  applyChrome,
  type ChromeTemplate,
} from "@/lib/canvas/chrome";
import type { ProjectPalette, TextStyleDef, TextStyleId } from "@/lib/canvas/document";
import type { FabricCanvasJSON, SlideItem } from "@/lib/types";
import type { CarouselSlideLayout, CarouselSlideSpec } from "./carousel-types";

const FONT = "Montserrat";
const MARGIN = 64;

function textObject(input: {
  text: string;
  styleId: TextStyleId;
  fontSize: number;
  fontWeight: string | number;
  fill: string;
  left: number;
  top: number;
  width: number;
  originX?: "left" | "center" | "right";
  originY?: "top" | "center";
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  charSpacing?: number;
  role?: string;
}) {
  return {
    type: "Textbox",
    originX: input.originX ?? "left",
    originY: input.originY ?? "top",
    left: input.left,
    top: input.top,
    width: input.width,
    text: input.text,
    fill: input.fill,
    fontSize: input.fontSize,
    fontFamily: FONT,
    fontWeight: input.fontWeight,
    lineHeight: input.lineHeight ?? 1.05,
    textAlign: input.textAlign ?? "left",
    charSpacing: input.charSpacing ?? 0,
    swibpStyle: input.styleId,
    swibpSlot: "text",
    ...(input.role ? { swibpRole: input.role } : {}),
  };
}

function defaultLayout(role: CarouselSlideSpec["role"], layout?: CarouselSlideLayout): CarouselSlideLayout {
  if (layout) return layout;
  if (role === "cover") return "center";
  return "editorial";
}

function cleanHeading(heading: string): string {
  return heading.replace(/^\s*\[?\d+\]?\s*[\/.]\s*/i, "").trim();
}

export function buildCarouselSlide(input: {
  spec: CarouselSlideSpec;
  palette: ProjectPalette;
  textStyles: Record<TextStyleId, TextStyleDef>;
  chrome: ChromeTemplate[];
  width: number;
  height: number;
  slideIndex: number;
  slideCount: number;
  id: number;
  tagline?: string;
  handle?: string;
  section?: string;
}): SlideItem {
  const { spec, palette, width, height, slideIndex, slideCount } = input;
  const layout = defaultLayout(spec.role, spec.layout);
  const background = spec.background ?? palette.background;
  const contentW = width - MARGIN * 2;
  const handle = (input.handle || "@swibp").replace(/^@/, "");
  const tagline = input.tagline?.trim() || "блог про ясный контент\nи карусели, которые читают";
  const section =
    input.section?.trim() ||
    (spec.role === "cover" ? "// обложка" : spec.role === "cta" ? "// дальше" : "// по делу");

  const centered = layout === "center";
  const split = layout === "split";
  const titleLeft = split ? MARGIN + Math.round(width * 0.06) : centered ? width / 2 : MARGIN;
  const titleWidth = split ? contentW - Math.round(width * 0.06) : contentW;

  const objects: Record<string, unknown>[] = [];

  objects.push(
    textObject({
      text: `[ @${handle} ]`,
      styleId: "body",
      fontSize: 20,
      fontWeight: 600,
      fill: palette.text,
      left: MARGIN,
      top: 56,
      width: Math.round(contentW * 0.45),
      charSpacing: 40,
      role: "handle",
    }),
  );
  objects.push(
    textObject({
      text: section,
      styleId: "body",
      fontSize: 20,
      fontWeight: 500,
      fill: palette.text,
      left: Math.round(width * 0.48),
      top: 56,
      width: Math.round(contentW * 0.5),
      textAlign: "right",
      charSpacing: 20,
    }),
  );

  if (split) {
    objects.push({
      type: "Rect",
      left: 0,
      top: 0,
      width: Math.round(width * 0.08),
      height,
      fill: palette.accent,
      selectable: true,
      swibpSlot: "accent",
    });
  }

  const displayTitle =
    spec.role === "point"
      ? `${slideIndex + 1} / ${cleanHeading(spec.heading)}`
      : cleanHeading(spec.heading);

  const headingSize = spec.role === "cover" ? 88 : spec.role === "cta" ? 72 : 64;
  const headingTop =
    layout === "top"
      ? Math.round(height * 0.2)
      : layout === "editorial"
        ? spec.role === "cover"
          ? Math.round(height * 0.32)
          : Math.round(height * 0.58)
        : Math.round(height * (spec.body ? 0.36 : 0.42));

  objects.push(
    textObject({
      text: displayTitle,
      styleId: "heading",
      fontSize: headingSize,
      fontWeight: "bold",
      fill: palette.text,
      left: titleLeft,
      top: headingTop,
      width: titleWidth,
      textAlign: centered ? "center" : "left",
      originX: centered ? "center" : "left",
      lineHeight: 0.92,
    }),
  );

  if (spec.body) {
    objects.push(
      textObject({
        text: spec.body,
        styleId: "body",
        fontSize: spec.role === "cover" ? 28 : 30,
        fontWeight: 400,
        fill: palette.text,
        left: titleLeft,
        top: headingTop + Math.round(headingSize * 1.3),
        width: titleWidth,
        textAlign: centered ? "center" : "left",
        originX: centered ? "center" : "left",
        lineHeight: 1.15,
      }),
    );
  }

  objects.push(
    textObject({
      text: tagline,
      styleId: "body",
      fontSize: 18,
      fontWeight: 400,
      fill: palette.text,
      left: MARGIN,
      top: height - 114,
      width: Math.round(contentW * 0.62),
      lineHeight: 1.15,
      role: "footer",
    }),
  );
  objects.push(
    textObject({
      text: `@${handle}`,
      styleId: "body",
      fontSize: 18,
      fontWeight: 500,
      fill: palette.text,
      left: Math.round(width * 0.62),
      top: height - 86,
      width: Math.round(contentW * 0.38),
      textAlign: "right",
      role: "handle",
    }),
  );
  objects.push(
    textObject({
      text: `[${slideIndex + 1}/${slideCount}]`,
      styleId: "body",
      fontSize: 18,
      fontWeight: 500,
      fill: palette.accent,
      left: Math.round(width * 0.62),
      top: height - 56,
      width: Math.round(contentW * 0.38),
      textAlign: "right",
      role: "number",
    }),
  );

  const canvasJSON: FabricCanvasJSON = {
    version: "6.0.0",
    background,
    objects,
  };

  return {
    id: input.id,
    thumbnail: null,
    canvasJSON: applyChrome(canvasJSON, input.chrome, input.slideIndex, input.slideCount),
  };
}
