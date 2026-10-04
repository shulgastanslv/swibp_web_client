import { create } from "zustand";
import type { InsightPlatform } from "@/lib/canvas/insights";

interface InsightUi {
  platform: InsightPlatform | null;
  showAttention: boolean;
  setPlatform: (platform: InsightPlatform | null) => void;
  setShowAttention: (showAttention: boolean) => void;
}

export const useInsightUi = create<InsightUi>((set) => ({
  platform: "Telegram",
  showAttention: false,
  setPlatform: (platform) => set({ platform }),
  setShowAttention: (showAttention) => set({ showAttention }),
}));
