import {
  ArrowUp,
  Layers,
  LayoutTemplate,
  Sparkles,
  Type,
  Undo2,
} from "lucide-react";

const SLIDES = [
  { label: "Cover" },
  { label: "Middle" },
  { label: "Middle" },
  { label: "Ending" },
] as const;

const RAIL = [
  { icon: Sparkles, active: true },
  { icon: LayoutTemplate, active: false },
  { icon: Type, active: false },
  { icon: Layers, active: false },
] as const;

export function EditorStage() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]" aria-hidden>
      <div className="relative rounded-t-[1.45rem] bg-[#14151c] p-2 pb-0 shadow-[0_28px_60px_rgba(20,21,28,0.16)]">
        <div className="absolute left-1/2 top-[7px] z-10 size-1.5 -translate-x-1/2 rounded-full bg-white/25" />
        <div className="overflow-hidden rounded-t-[0.95rem] bg-[#f4f5f9]">
          <div className="flex h-8 items-center justify-between border-b border-black/[0.06] bg-white px-2">
            <div className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-[5px] bg-[#2f5bff] text-[8px] font-extrabold text-white">
                S
              </span>
              <span className="rounded-full bg-[#f4f5f9] px-2 py-0.5 text-[9px] font-semibold text-[#14151c]">
                Feed
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Undo2 className="size-3 text-muted-foreground" />
              <button className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                Save
              </button>
              <button className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold text-white">
                <ArrowUp className="size-2.5" />
                Export
              </button>
            </div>
          </div>

          <div className="grid min-h-[228px] grid-cols-[28px_minmax(0,1fr)_86px]">
            <aside className="flex flex-col items-center gap-2 border-r border-black/[0.06] bg-white py-2.5">
              {RAIL.map(({ icon: Icon, active }, index) => (
                <span
                  key={index}
                  className={`grid size-5 place-items-center rounded-md ${
                    active ? "bg-[#e4ebff] text-[#2f5bff]" : "text-[#8b90a0]"
                  }`}
                >
                  <Icon className="size-3" />
                </span>
              ))}
            </aside>

            <div
              className="flex flex-col px-2.5 py-2"
              style={{
                backgroundImage:
                  "radial-gradient(#d5d8e4 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            >
              <div className="mx-auto flex w-fit items-center rounded-full bg-white p-0.5 shadow-[0_1px_0_rgba(20,21,28,0.04)]">
                {["4:5", "1:1", "9:16"].map((ratio) => (
                  <span
                    key={ratio}
                    className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${
                      ratio === "4:5"
                        ? "bg-[#14151c] text-white"
                        : "text-[#8b90a0]"
                    }`}
                  >
                    {ratio}
                  </span>
                ))}
              </div>
              <div className="relative mx-auto mt-2 aspect-[4/5] w-[42%] overflow-hidden rounded-lg bg-white shadow-[0_10px_24px_rgba(20,21,28,0.12)]">
                <div className="h-full w-full bg-muted" />
                <div className="pointer-events-none absolute inset-[14%] rounded border border-[#2f5bff]">
                  <span className="absolute -left-1 -top-1 size-2 rounded-full bg-white ring-1 ring-[#2f5bff]" />
                  <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white ring-1 ring-[#2f5bff]" />
                  <span className="absolute -bottom-1 -left-1 size-2 rounded-full bg-white ring-1 ring-[#2f5bff]" />
                  <span className="absolute -bottom-1 -right-1 size-2 rounded-full bg-white ring-1 ring-[#2f5bff]" />
                </div>
              </div>
            </div>

            <aside className="space-y-1.5 border-l border-black/[0.06] bg-white p-1.5">
              <div className="rounded-lg bg-[#f4f5f9] p-1.5">
                <p className="text-[8px] font-bold text-[#8b90a0]">Text</p>
                <div className="mt-1 h-1 rounded-full bg-[#14151c]/20" />
                <div className="mt-0.5 h-1 w-2/3 rounded-full bg-[#14151c]/10" />
              </div>
              <div className="rounded-lg bg-[#f4f5f9] p-1.5">
                <p className="text-[8px] font-bold text-[#8b90a0]">Fill</p>
                <div className="mt-1 flex gap-1">
                  <span className="size-2.5 rounded-full bg-[#2f5bff]" />
                  <span className="size-2.5 rounded-full bg-[#14151c]" />
                  <span className="size-2.5 rounded-full bg-[#ffe08a]" />
                </div>
              </div>
              <div className="rounded-lg bg-[#f4f5f9] p-1.5">
                <p className="text-[8px] font-bold text-[#8b90a0]">Layers</p>
                <div className="mt-1 space-y-0.5">
                  <div className="h-1 rounded-full bg-[#2f5bff]/50" />
                  <div className="h-1 w-4/5 rounded-full bg-[#14151c]/15" />
                  <div className="h-1 w-3/5 rounded-full bg-[#14151c]/10" />
                </div>
              </div>
            </aside>
          </div>

          <div className="flex items-end justify-center gap-2 border-t border-black/[0.06] bg-white px-3 py-2">
            {SLIDES.map((slide, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-6 rounded bg-muted ${
                    index === 2
                      ? "ring-2 ring-[#2f5bff]"
                      : "opacity-70"
                  }`}
                />
                <span className="text-[7px] font-semibold tracking-wide text-[#8b90a0]">
                  {slide.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-2.5 rounded-b-[0.55rem] bg-[#14151c]" />
      <div className="relative -mt-px h-3.5 w-[106%] -translate-x-[3%] rounded-b-[1.1rem] bg-gradient-to-b from-[#d8dbe4] to-[#b4b8c4] shadow-[0_14px_28px_rgba(20,21,28,0.12)]">
        <div className="absolute left-1/2 top-0 h-1.5 w-14 -translate-x-1/2 rounded-b-md bg-[#14151c]" />
      </div>
    </div>
  );
}
