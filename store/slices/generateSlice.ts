import type { StateCreator } from "zustand";

export type GenerateStatus = "idle" | "streaming" | "building" | "done" | "error";
/** Canvas Stitch FX: wireframe composing → reveal into real slide. */
export type GenerateFx = "idle" | "composing" | "revealing";

export interface GeneratePreviewSlide {
  id: number;
  index: number;
  heading: string;
  background: string;
  thumbnail: string | null;
}

export interface GenerateSlice {
  genStatus: GenerateStatus;
  genPhase: string;
  genProgress: number;
  genExpectedSlides: number;
  genBuiltCount: number;
  genTitle: string | null;
  genError: string | null;
  genTheme: string;
  genPreview: GeneratePreviewSlide[];
  /** Bumps to trigger the Stitch stage entrance animation. */
  genStagePulse: number;
  genFx: GenerateFx;
  setGenerate: (patch: Partial<GenerateSlice>) => void;
  resetGenerate: () => void;
  pushGeneratePreview: (slide: GeneratePreviewSlide) => void;
  patchGeneratePreview: (id: number, patch: Partial<GeneratePreviewSlide>) => void;
}

const initial = {
  genStatus: "idle" as GenerateStatus,
  genPhase: "",
  genProgress: 0,
  genExpectedSlides: 0,
  genBuiltCount: 0,
  genTitle: null as string | null,
  genError: null as string | null,
  genTheme: "",
  genPreview: [] as GeneratePreviewSlide[],
  genStagePulse: 0,
  genFx: "idle" as GenerateFx,
};

export const createGenerateSlice: StateCreator<GenerateSlice, [], [], GenerateSlice> = (set) => ({
  ...initial,
  setGenerate: (patch) => set(patch),
  resetGenerate: () => set({ ...initial, genStagePulse: 0 }),
  pushGeneratePreview: (slide) =>
    set((state) => ({
      genPreview: [...state.genPreview.filter((item) => item.id !== slide.id), slide].sort(
        (a, b) => a.index - b.index,
      ),
    })),
  patchGeneratePreview: (id, patch) =>
    set((state) => ({
      genPreview: state.genPreview.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
});
