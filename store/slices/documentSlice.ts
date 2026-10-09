import type { StateCreator } from "zustand";
import {
  defaultDocument,
  normalizeDocument,
  type DocumentMeta,
  type ProjectPalette,
  type TextStyleDef,
  type TextStyleId,
} from "@/lib/canvas/document";
import type { ChromeTemplate } from "@/lib/canvas/chrome";

export interface DocumentSlice {
  palette: ProjectPalette;
  textStyles: DocumentMeta["textStyles"];
  chrome: ChromeTemplate[];
  setPalette: (palette: ProjectPalette) => void;
  setTextStyle: (id: TextStyleId, style: TextStyleDef) => void;
  setChrome: (chrome: ChromeTemplate[]) => void;
  /** Replaces document settings without marking the project dirty. */
  replaceDocument: (input: unknown) => void;
}

const initial = defaultDocument();

export const createDocumentSlice: StateCreator<DocumentSlice, [], [], DocumentSlice> = (
  set,
  get,
) => ({
  palette: initial.palette,
  textStyles: initial.textStyles,
  chrome: initial.chrome,

  setPalette: (palette) => set({ palette }),
  setTextStyle: (id, style) =>
    set({ textStyles: { ...get().textStyles, [id]: style } }),
  setChrome: (chrome) => set({ chrome }),
  replaceDocument: (input) => {
    const doc = normalizeDocument(input);
    set({
      palette: doc.palette,
      textStyles: doc.textStyles,
      chrome: doc.chrome,
    });
  },
});
