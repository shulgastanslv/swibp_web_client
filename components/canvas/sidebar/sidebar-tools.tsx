"use client";

import { useState } from "react";
import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import { useSlides } from "@/hooks/use-slides";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
import { cn } from "@/lib/utils";
import type { Side, SlideNumberStyle } from "@/lib/canvas/objects";
import { formatSlideNumber } from "@/lib/canvas/objects";
import { slidesFromLines, splitSlideLines, TEXT_STYLES, type TextStyleId } from "@/lib/canvas/document";
import { useCanvasStore } from "@/store/useCanvasStore";
import { ScreenSplit } from "@/components/canvas/sidebar/screen-split";

const NUMBER_STYLES: readonly SlideNumberStyle[] = ["1", "01", "1 / 8"];

const PLATFORMS = ["Telegram", "Threads", "Instagram", "X"] as const;

const HOOK_GROUPS = [
  {
    id: "hooks-contrarian",
    title: "Contrarian",
    hooks: [
      "Я ошибался насчёт этого.",
      "Попробуй наоборот.",
      "Большинство делает это неправильно.",
      "Дисциплина переоценена.",
      "Мотивация — не твоя проблема.",
      "Копить деньги — плохой совет.",
      "Ранний подъём ничего не решает.",
      "Чтение книг не делает умнее.",
      "Нетворкинг — пустая трата времени.",
      "Многозадачность — миф.",
      "Твой диплом никому не нужен.",
      "Лучше меньше, но хуже.",
      "Хватит планировать.",
      "Цели мешают расти.",
      "Не слушай успешных людей.",
      "Отдых важнее работы.",
      "Удалить — лучше, чем улучшить.",
      "Хобби не должно приносить деньги.",
      "Идеальный план — ловушка.",
      "Прокрастинация — это сигнал.",
      "Не нужно быть лучшим.",
      "Опыт переоценён.",
      "Делай медленнее.",
      "Говори «нет» чаще.",
      "Правила созданы не для тебя.",
    ],
  },
  {
    id: "hooks-curiosity",
    title: "Curiosity",
    hooks: [
      "Об этом никто не говорит.",
      "Прочитай дважды.",
      "Тихая часть.",
      "Одна привычка изменила всё.",
      "То, что скрывают богатые.",
      "Почему ты устаёшь к обеду.",
      "Секрет, который знают дизайнеры.",
      "Что происходит после 30.",
      "Этому не учат в школе.",
      "Главное — в конце.",
      "Как я нашёл своё дело.",
      "Что общего у всех счастливых пар.",
      "Пять минут, которые меняют день.",
      "Ты делаешь это каждый день.",
      "Правда о фрилансе.",
      "Что я понял за 10 лет в бизнесе.",
      "Почему твой контент не заходит.",
      "Вопрос, который всё меняет.",
      "Этого не знает твой врач.",
      "Как мозг решает за тебя.",
      "Самый недооценённый навык.",
      "Почему умные люди бедные.",
      "Что скрывает твой календарь.",
      "Один файл. Вся система.",
      "Это заметят только 1%.",
    ],
  },
  {
    id: "hooks-confession",
    title: "Confession",
    hooks: [
      "Буду честен.",
      "Это стоило мне дорого.",
      "Я понял это слишком поздно.",
      "Я выгорел и не заметил.",
      "Я потерял всё за год.",
      "Я боялся публиковать это.",
      "Я уволился без плана.",
      "Я врал себе 5 лет.",
      "Мой первый бизнес провалился.",
      "Я не умел отдыхать.",
      "Я завидовал друзьям.",
      "Я откладывал жизнь на потом.",
      "Я жил ради чужого одобрения.",
      "Я не любил свою работу.",
      "Я боялся денег.",
      "Я не умел говорить «нет».",
      "Я сравнивал себя с каждым.",
      "Я чуть не бросил.",
      "Я ошибся с выбором профессии.",
      "Я тратил больше, чем зарабатывал.",
      "Я молчал, когда надо было говорить.",
      "Я не верил в себя.",
      "Я жил на автопилоте.",
      "Я боялся начать заново.",
      "Это мой самый большой провал.",
    ],
  },
  {
    id: "hooks-proof",
    title: "Proof",
    hooks: [
      "Сохрани это.",
      "Что реально сработало.",
      "30 дней. Одно изменение.",
      "Результат за 90 дней.",
      "С 0 до 10 000 подписчиков.",
      "Я проверил на себе.",
      "Минус 12 кг без диет.",
      "Первые деньги за 2 недели.",
      "Система, которая работает годами.",
      "3 шага. Один результат.",
      "Я протестировал 50 способов.",
      "Что дало 80% результата.",
      "Моя утренняя рутина. Цифры.",
      "Так я закрыл кредит.",
      "Одна таблица вместо 10 приложений.",
      "Я читаю 50 книг в год. Вот как.",
      "Доход вырос в 3 раза.",
      "Проверено на 100 клиентах.",
      "Это сэкономило мне 10 часов в неделю.",
      "Чек-лист, который я использую сам.",
      "Год без соцсетей. Итоги.",
      "Так я выучил язык за 6 месяцев.",
      "Шаблон, который продаёт.",
      "Метод, который не подвёл ни разу.",
      "Простая формула. Работает.",
    ],
  },
  {
    id: "hooks-warning",
    title: "Warning",
    hooks: [
      "Остановись.",
      "Прежде чем публиковать.",
      "Не пропусти это.",
      "Хватит так делать.",
      "Это убивает твою продуктивность.",
      "Ошибка, которая стоит лет.",
      "Не покупай это.",
      "Не начинай бизнес без этого.",
      "Это разрушает отношения.",
      "Твой телефон крадёт твою жизнь.",
      "Не повторяй мою ошибку.",
      "Прочти перед собеседованием.",
      "Опасный совет, который все дают.",
      "Так теряют деньги.",
      "Это сигнал выгорания.",
      "Не игнорируй этот симптом.",
      "Пока не поздно.",
      "Так ты теряешь клиентов.",
      "Красный флаг в любой команде.",
      "Проверь это сегодня.",
      "Привычка, которая тормозит рост.",
      "Эти слова портят текст.",
      "Не подписывай, не прочитав.",
      "Три ошибки новичков.",
      "Последнее предупреждение.",
    ],
  },
] as const;


const actionButton =
  "h-7 rounded-full bg-muted px-2.5 text-[11px] text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40";
const fieldInput =
  "h-7 w-full rounded-full bg-muted/40 px-3 text-[11px] outline-none placeholder:text-muted-foreground focus:bg-muted/60";
const sectionTitle = "px-1 text-[11px] font-medium text-muted-foreground";

export function SidebarTools() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const { currentIndex, slides } = useSlides();
  const [prompt, setPrompt] = useState("");
  const [slideStyle, setSlideStyle] = useState<TextStyleId>("heading");
  const [handle, setHandle] = useState("@username");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number] | null>("Telegram");
  const [info, setInfo] = useState("text");

  const slideIndex = Math.max(currentIndex, 0);
  const slideTotal = Math.max(slides.length, 1);

  const addHandle = (side: Side) =>
    manager?.objects.addCornerHandle(handle.trim() || "@username", side, platform ?? undefined);

  const lineCount = splitSlideLines(prompt).length;

  const generateSlides = () => {
    if (!lineCount || !slidesController) return;
    const state = useCanvasStore.getState();
    const next = slidesFromLines({
      text: prompt,
      styleId: slideStyle,
      style: state.textStyles[slideStyle],
      palette: state.palette,
      chrome: state.chrome,
      width: state.canvasDimensions.width,
      height: state.canvasDimensions.height,
    });
    if (next.length === 0) return;
    state.setSlides(next);
    state.setCurrentSlideId(next[0]!.id);
    state.setDirty(true);
    void slidesController.loadCurrent();
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-2 text-foreground">
      <ScreenSplit />

      <section className="space-y-1.5">
        <h3 className={sectionTitle}>Slides from text</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="One line, one slide"
          rows={3}
          className="w-full resize-none rounded-xl bg-muted/30 px-3 py-2 text-xs leading-relaxed outline-none placeholder:text-muted-foreground focus:bg-muted/40"
        />
        <div className="grid grid-cols-3 gap-1">
          {TEXT_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSlideStyle(style.id)}
              className={cn(
                "h-7 rounded-full px-1 text-xs transition-colors",
                slideStyle === style.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!lineCount || !slidesController}
          onClick={generateSlides}
          className={cn(actionButton, "w-full")}
        >
          Generate{lineCount > 0 ? ` · ${lineCount}` : ""}
        </button>
      </section>

      <section className="space-y-1.5">
        <h3 className={sectionTitle}>Slide numbers</h3>
        <div className="grid grid-cols-4 gap-1">
          {NUMBER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              disabled={!manager}
              title={`Add "${formatSlideNumber(style, slideIndex, slideTotal)}" to the top-left corner`}
              onClick={() => manager?.objects.addSlideNumber(style, slideIndex, slideTotal)}
              className={actionButton}
            >
              {formatSlideNumber(style, slideIndex, slideTotal)}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className={sectionTitle}>Author handle</h3>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@username"
          className={fieldInput}
        />
        <div className="flex gap-1">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(platform === p ? null : p)}
              className={cn(
                "h-7 min-w-0 flex-1 truncate rounded-full px-1 text-xs transition-colors",
                platform === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {p === "Instagram" ? "Insta" : p === "Telegram" ? "TG" : p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            disabled={!manager}
            onClick={() => addHandle("left")}
            className={actionButton}
          >
            Top left
          </button>
          <button
            type="button"
            disabled={!manager}
            onClick={() => addHandle("right")}
            className={actionButton}
          >
            Top right
          </button>
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className={sectionTitle}>Swipe cues</h3>
        <button
          type="button"
          disabled={!manager}
          onClick={() => manager?.objects.addSwipeArrow()}
          className={cn(actionButton, "flex w-full items-center justify-between px-3 text-xs")}
        >
          <span>Arrow</span>
          <span className="font-mono">-&gt;</span>
        </button>
        <input
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="text"
          className={fieldInput}
        />
        <div className="grid grid-cols-2 gap-1 text-xs">
          {(
            [
              `[${info.trim() || "text"}]`,
              info.trim() || "text",
              `(${info.trim() || "text"})`,
              `- ${info.trim() || "text"}`,
            ] as const
          ).map((cue) => (
            <button
              key={cue}
              type="button"
              disabled={!manager}
              onClick={() => manager?.objects.addSwipeCue(cue)}
              className={cn(actionButton, "truncate px-2 text-xs")}
            >
              {cue}
            </button>
          ))}
        </div>
      </section>

      <div className="-mx-2">
        {HOOK_GROUPS.map((group) => (
          <CollapsibleGroup
            key={group.id}
            id={group.id}
            title={group.title}
            defaultOpen={false}
            className="border-border/40"
          >
            <div className="-mx-1 flex flex-col gap-0.5">
              {group.hooks.map((hook) => (
                <button
                  key={hook}
                  type="button"
                  disabled={!manager}
                  onClick={() => manager?.objects.addHeading(hook)}
                  className="rounded-lg px-2 py-1.5 text-left text-xs leading-snug text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40"
                >
                  {hook}
                </button>
              ))}
            </div>
          </CollapsibleGroup>
        ))}
      </div>
    </div>
  );
}
