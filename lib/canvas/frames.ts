export const FRAME_KINDS = ["iphone", "android", "ipad", "tablet", "laptop", "monitor"] as const;
export type FrameKind = (typeof FRAME_KINDS)[number];

export function isFrameKind(value: string): value is FrameKind {
  return (FRAME_KINDS as readonly string[]).includes(value);
}
