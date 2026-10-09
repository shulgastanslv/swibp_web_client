import type { CanvasManager } from "@/lib/canvas/manager";
import type { SlidesController } from "@/lib/canvas/slides";
import { defaultDocument, type ProjectPalette } from "@/lib/canvas/document";
import { parseCarouselEvent } from "@/lib/ai/carousel-parse";
import { buildCarouselSlide } from "@/lib/ai/carousel-slide";
import { animateSlideEntrance } from "@/lib/ai/animate-slide";
import {
  backgroundsForSet,
  suggestedSetById,
} from "@/lib/ai/carousel-style";
import type { CarouselStreamEvent } from "@/lib/ai/carousel-types";
import { SUGGESTED_SETS } from "@/lib/presets/backgrounds";
import type { CanvasStoreState } from "@/store/useCanvasStore";

type Store = {
  getState: () => CanvasStoreState;
};

async function readNdjsonStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: CarouselStreamEvent) => Promise<void> | void,
  signal?: AbortSignal,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      while (true) {
        const nl = buffer.indexOf("\n");
        if (nl === -1) break;
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        try {
          const raw = JSON.parse(line) as unknown;
          const event = parseCarouselEvent(raw);
          if (event) await onEvent(event);
        } catch {
          // skip bad lines
        }
      }
    }
    const tail = buffer.trim();
    if (tail) {
      try {
        const event = parseCarouselEvent(JSON.parse(tail));
        if (event) await onEvent(event);
      } catch {
        // ignore
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function runCarouselGenerate(input: {
  theme: string;
  slides: number;
  setId?: string;
  store: Store;
  manager: CanvasManager;
  slidesController: SlidesController;
  signal?: AbortSignal;
}): Promise<void> {
  const { store, manager, slidesController, signal } = input;
  const theme = input.theme.trim();
  const expected = Math.min(20, Math.max(1, Math.round(input.slides)));
  const setId = input.setId?.trim() || undefined;

  store.getState().resetGenerate();
  store.getState().setGenerate({
    genStatus: "streaming",
    genPhase: "Talking to Kimi…",
    genProgress: 0.05,
    genExpectedSlides: expected,
    genTheme: theme,
    genFx: "composing",
  });

  const response = await fetch("/api/generate/carousel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, slides: expected, setId }),
    signal,
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error || `Generate failed (${response.status})`);
  }
  if (!response.body) throw new Error("Empty generation stream");

  let palette: ProjectPalette = store.getState().palette ?? defaultDocument().palette;
  let slideBackgrounds: string[] = [];
  let tagline: string | undefined;
  let handle: string | undefined;
  let built = 0;
  let finished = false;
  const slideCountHint = expected;

  slidesController.saveCurrent({ thumbnail: false });

  await readNdjsonStream(
    response.body,
    async (event) => {
      if (signal?.aborted || finished) return;

      if (event.type === "meta") {
        store.getState().setGenerate({
          genExpectedSlides: event.slides,
          genPhase: "Composing the story…",
          genProgress: 0.1,
        });
        return;
      }

      if (event.type === "palette") {
        const locked = setId ? suggestedSetById(setId) : null;
        const set =
          locked ??
          suggestedSetById(event.setId) ??
          SUGGESTED_SETS.find(
            (item) => item.background.toLowerCase() === event.background.toLowerCase(),
          ) ??
          SUGGESTED_SETS[0]!;
        palette = locked
          ? {
              background: locked.background,
              text: locked.text,
              accent: locked.accent,
              card: locked.card,
            }
          : {
              background: event.background,
              text: event.text,
              accent: event.accent,
              card: event.card,
            };
        tagline = event.tagline;
        handle = event.handle;
        slideBackgrounds = backgroundsForSet(set, expected);
        store.getState().setPalette(palette);
        store.getState().setGenerate({
          genPhase: `Palette · ${set.label}`,
          genProgress: 0.18,
        });
        return;
      }

      if (event.type === "slide") {
        store.getState().setGenerate({
          genStatus: "building",
          genPhase: `Building slide ${event.index + 1}`,
          genFx: "composing",
        });

        // Let the wireframe assemble briefly before the reveal (Stitch pacing).
        await new Promise((r) => setTimeout(r, built === 0 ? 520 : 380));
        if (signal?.aborted) return;

        const state = store.getState();
        const id = built === 0 ? 1 : Math.max(0, ...state.slides.map((s) => s.id)) + 1;
        const bg =
          event.background ||
          slideBackgrounds[built] ||
          palette.background;
        const slide = buildCarouselSlide({
          spec: { ...event, background: bg },
          palette,
          textStyles: state.textStyles,
          chrome: state.chrome,
          width: state.canvasDimensions.width,
          height: state.canvasDimensions.height,
          slideIndex: built,
          slideCount: Math.max(slideCountHint, built + 1),
          id,
          tagline,
          handle,
        });

        store.getState().setGenerate({
          genFx: "revealing",
          genStagePulse: store.getState().genStagePulse + 1,
        });

        let liveId = slide.id;
        if (built === 0) {
          state.setSlides([slide]);
          state.setCurrentSlideId(slide.id);
          await slidesController.loadCurrent();
        } else {
          await slidesController.insert(slide.canvasJSON, null);
          liveId = store.getState().currentSlideId;
        }

        store.getState().pushGeneratePreview({
          id: liveId,
          index: event.index,
          heading: event.heading,
          background: (slide.canvasJSON.background as string) || palette.background,
          thumbnail: null,
        });

        store.getState().setGenerate({
          genBuiltCount: built + 1,
          genProgress: Math.min(0.95, 0.2 + ((built + 1) / Math.max(1, expected)) * 0.7),
        });

        await animateSlideEntrance(manager.canvas);
        slidesController.saveCurrent({ thumbnail: true });
        const thumb = manager.captureThumbnail();
        if (thumb) store.getState().patchGeneratePreview(liveId, { thumbnail: thumb });

        built += 1;
        store.getState().setDirty(true);

        const moreComing = built < expected && !finished;
        store.getState().setGenerate({
          genFx: moreComing ? "composing" : "idle",
        });
        return;
      }

      if (event.type === "done") {
        finished = true;
        store.getState().setGenerate({
          genStatus: "done",
          genPhase: "Carousel ready",
          genProgress: 1,
          genTitle: event.title,
          genFx: "idle",
        });
        if (event.title) store.getState().setProjectTitle(event.title);
        return;
      }

      if (event.type === "error") {
        finished = true;
        store.getState().setGenerate({
          genStatus: "error",
          genError: event.message,
          genPhase: "Generation failed",
          genFx: "idle",
        });
      }
    },
    signal,
  );

  if (signal?.aborted) {
    store.getState().setGenerate({ genStatus: "idle", genPhase: "", genFx: "idle" });
    return;
  }

  const current = store.getState();
  if (current.genStatus === "building" || current.genStatus === "streaming") {
    store.getState().setGenerate({
      genStatus: built > 0 ? "done" : "error",
      genPhase: built > 0 ? "Carousel ready" : "No slides generated",
      genProgress: built > 0 ? 1 : 0,
      genError: built > 0 ? null : "No slides generated",
      genFx: "idle",
    });
  } else {
    store.getState().setGenerate({ genFx: "idle" });
  }
}
