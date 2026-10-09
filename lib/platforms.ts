import type { RatioKey } from "@/lib/types";

export const PLATFORMS = [
  { id: "Insta", label: "Insta", ratio: "4:5" },
  { id: "TikTok", label: "TikTok", ratio: "9:16" },
  { id: "Threads", label: "Threads", ratio: "4:5" },
  { id: "LinkedIn", label: "LinkedIn", ratio: "1:1" },
  { id: "Other", label: "Other", ratio: "4:5" },
] as const satisfies readonly { id: string; label: string; ratio: RatioKey }[];

export type PlatformId = (typeof PLATFORMS)[number]["id"];

export function platformById(id: string) {
  return PLATFORMS.find((platform) => platform.id === id) ?? PLATFORMS[0];
}
