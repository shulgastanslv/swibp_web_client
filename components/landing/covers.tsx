import { cn } from "@/lib/utils";

function Dots({ active = 0, count = 6, light = false }: { active?: number; count?: number; light?: boolean }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 rounded-full",
            index === active ? "w-4" : "w-1.5",
            light
              ? index === active
                ? "bg-white"
                : "bg-white/35"
              : index === active
                ? "bg-[#161513]"
                : "bg-[#161513]/25",
          )}
        />
      ))}
    </span>
  );
}

export function CoverHook({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex aspect-[4/5] w-full flex-col justify-between rounded-[1.5rem] bg-[#f4efe6] p-6 text-[#161513] sm:p-8",
        className,
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-[#8a8478]">
        <span>КАРУСЕЛЬ</span>
        <span>01 / 06</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#2f5bff]">ИИ собрал серию</p>
        <h3 className="mt-3 font-serif text-[2.1rem] leading-[0.92] sm:text-5xl">
          Карусель
          <br />
          из одной
          <br />
          мысли
        </h3>
        <p className="mt-4 inline-block rounded-lg bg-[#2f5bff] px-2.5 py-1 text-lg font-semibold text-white">
          листай дальше
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#5c584f]">Обложка серии</span>
        <Dots />
      </div>
    </article>
  );
}

export function CoverList({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex aspect-[4/5] w-full flex-col justify-between rounded-[1.5rem] bg-[#14151c] p-6 text-white sm:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em] text-[#a78bfa]">
        <span>СЛАЙД 02</span>
        <span>02 / 06</span>
      </div>
      <div>
        <h3 className="text-3xl leading-none font-extrabold sm:text-4xl">
          Три кадра,
          <br />
          одна история
        </h3>
        <ul className="mt-5 space-y-2 text-sm">
          <li className="rounded-xl bg-white/10 px-3 py-2.5">01 Обложка цепляет</li>
          <li className="rounded-xl bg-white/10 px-3 py-2.5">02 Середина объясняет</li>
          <li className="rounded-xl bg-[#2f5bff] px-3 py-2.5">03 Финал зовёт</li>
        </ul>
      </div>
      <Dots active={1} light />
    </article>
  );
}

export function CoverClose({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex aspect-[4/5] w-full flex-col justify-between rounded-[1.5rem] bg-[#e7deff] p-6 text-[#1a1333] sm:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em] text-[#5c4d86]">
        <span>ФИНАЛ</span>
        <span>06 / 06</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#6d4aff]">Сохрани серию</p>
        <h3 className="mt-3 text-4xl leading-[0.95] font-extrabold sm:text-5xl">
          Забери
          <br />
          карусель
        </h3>
        <div className="mt-5 inline-flex rounded-full bg-[#1a1333] px-4 py-2 text-sm font-semibold text-white">
          PNG · 1080×1350
        </div>
      </div>
      <Dots active={5} />
    </article>
  );
}
