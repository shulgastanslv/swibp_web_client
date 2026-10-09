import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Dots({ active = 0, count = 6 }: { active?: number; count?: number }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 rounded-full",
            index === active ? "w-4 bg-white" : "w-1.5 bg-white/45",
          )}
        />
      ))}
    </span>
  );
}

function PhotoSlide({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] text-white",
        className,
      )}
    >
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35" />
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">{children}</div>
    </article>
  );
}

export function CoverHook({ className }: { className?: string }) {
  return (
    <PhotoSlide src="/landing/slide-cover.jpg" alt="Обложка карусели" className={className}>
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em]">
        <span>КАРУСЕЛЬ</span>
        <span>01 / 06</span>
      </div>
      <div>
        <p className="text-sm font-semibold">ИИ создал карусель</p>
        <h3 className="mt-2 text-3xl leading-[0.95] font-extrabold sm:text-4xl">
          Карусель
          <br />
          из одной
          <br />
          мысли
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Обложка</span>
        <Dots />
      </div>
    </PhotoSlide>
  );
}

export function CoverList({ className }: { className?: string }) {
  return (
    <PhotoSlide src="/landing/slide-mid.jpg" alt="Второй слайд карусели" className={className}>
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em]">
        <span>СЛАЙД 02</span>
        <span>02 / 06</span>
      </div>
      <div>
        <h3 className="text-3xl leading-none font-extrabold">
          Три кадра,
          <br />
          одна история
        </h3>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="rounded-xl bg-black/35 px-3 py-2 backdrop-blur-sm">01 Обложка цепляет</li>
          <li className="rounded-xl bg-black/35 px-3 py-2 backdrop-blur-sm">02 Середина объясняет</li>
          <li className="rounded-xl bg-[#2f5bff]/90 px-3 py-2">03 Финал зовёт</li>
        </ul>
      </div>
      <Dots active={1} />
    </PhotoSlide>
  );
}

export function CoverClose({ className }: { className?: string }) {
  return (
    <PhotoSlide src="/landing/slide-end.jpg" alt="Финальный слайд карусели" className={className}>
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em]">
        <span>ФИНАЛ</span>
        <span>06 / 06</span>
      </div>
      <div>
        <p className="text-sm font-semibold">Карусель готова</p>
        <h3 className="mt-2 text-4xl leading-[0.95] font-extrabold">
          Забери
          <br />
          кадры
        </h3>
        <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14151c]">
          6 слайдов
        </div>
      </div>
      <Dots active={5} />
    </PhotoSlide>
  );
}
