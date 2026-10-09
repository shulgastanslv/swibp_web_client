"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/landing/hero-stage";
import { InstagramFeed, ThreadsFeed, type FeedSlide } from "@/components/landing/social-feed";

type Audience = {
  id: string;
  name: string;
  app: "instagram" | "threads";
  handle: string;
  avatar: string;
  post: string;
  text: string;
  panel: string;
  slides: FeedSlide[];
};

const AUDIENCES: Audience[] = [
  {
    id: "dev",
    name: "Программисты",
    app: "instagram",
    handle: "релиз",
    avatar: "/landing/slide-mid.jpg",
    post: "Карусель про выкладку: что проверить и чем закончить.",
    text: "Один шаг — один кадр.",
    panel: "#e4ebff",
    slides: [
      {
        src: "/landing/slide-mid.jpg",
        title: "Релиз без паники",
        caption: "Обложка называет, о чём карусель.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "Три проверки",
        caption: "Середина раскладывает шаги.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "Можно выкатывать",
        caption: "Финал оставляет действие.",
      },
    ],
  },
  {
    id: "smm",
    name: "SMM",
    app: "threads",
    handle: "лента",
    avatar: "/landing/slide-cover.jpg",
    post: "Рубрика на шесть кадров. Обложка, объяснение, финал.",
    text: "Рубрика за минуты, не за вечер.",
    panel: "#ffe4ef",
    slides: [
      {
        src: "/landing/slide-cover.jpg",
        title: "Крючок для ленты",
        caption: "Первый кадр останавливает прокрутку.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "Рубрика по порядку",
        caption: "Слайды читаются друг за другом.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Что сделать дальше",
        caption: "Последний кадр не повторяет обложку.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Маркетологи",
    app: "instagram",
    handle: "запуск",
    avatar: "/landing/slide-end.jpg",
    post: "Запуск в одной карусели: кому, зачем и что дальше.",
    text: "Запуск в одной ленте.",
    panel: "#fff4cc",
    slides: [
      {
        src: "/landing/slide-end.jpg",
        title: "Запуск без шума",
        caption: "Обложка говорит, зачем открыть.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Кому это нужно",
        caption: "Середина объясняет без жаргона.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "Следующий шаг",
        caption: "Финал оставляет действие.",
      },
    ],
  },
  {
    id: "editors",
    name: "Редакторы",
    app: "threads",
    handle: "редакция",
    avatar: "/landing/slide-cover.jpg",
    post: "Один тезис на слайд. Карусель держит ритм колонки.",
    text: "Один тезис на кадр.",
    panel: "#efe7ff",
    slides: [
      {
        src: "/landing/slide-cover.jpg",
        title: "Один тезис",
        caption: "Обложка держит обещание текста.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Середина без воды",
        caption: "Каждый слайд добавляет шаг.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "Финал коротко",
        caption: "Последний кадр закрывает мысль.",
      },
    ],
  },
  {
    id: "founders",
    name: "Основатели",
    app: "instagram",
    handle: "продукт",
    avatar: "/landing/slide-end.jpg",
    post: "Зачем продукт, как устроен и куда идти дальше.",
    text: "Продукт без питч-дека.",
    panel: "#e5f6ea",
    slides: [
      {
        src: "/landing/slide-end.jpg",
        title: "Зачем продукт",
        caption: "Обложка формулирует обещание.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "Как это устроено",
        caption: "Середина показывает путь.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Куда дальше",
        caption: "Финал оставляет следующий шаг.",
      },
    ],
  },
];

export function AudienceBlock() {
  const reduce = useReducedMotion();
  const [audience, setAudience] = useState(0);
  const [slide, setSlide] = useState(0);
  const role = AUDIENCES[audience];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % role.slides.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce, role.slides.length, audience]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setAudience((current) => (current + 1) % AUDIENCES.length);
      setSlide(0);
    }, 8400);
    return () => window.clearInterval(id);
  }, [reduce, audience]);

  function pick(index: number) {
    setAudience(index);
    setSlide(0);
  }

  return (
    <section id="audiences" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-bold tracking-wide text-[#2f5bff]">Для кого</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Одна студия — разные ленты
        </h2>
      </div>

      <div
        className="overflow-hidden rounded-[2rem] px-6 py-10 transition-colors duration-500 sm:rounded-[2.4rem] sm:px-10 sm:py-12"
        style={{ background: role.panel }}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {role.name}
            </h3>
            <p className="mt-3 text-base font-medium text-[#5c6170]">{role.text}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {AUDIENCES.map((item, index) => {
                const active = index === audience;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(index)}
                    className={
                      active
                        ? "h-10 rounded-full bg-[#14151c] px-4 text-sm font-semibold text-white"
                        : "h-10 rounded-full bg-white/70 px-4 text-sm font-semibold text-[#14151c]"
                    }
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[420px] w-full max-w-[280px] items-end justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={role.id}
                className="relative z-10 w-[230px] sm:w-[250px]"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <PhoneFrame className="h-[460px] w-[230px] border-[7px] sm:h-[500px] sm:w-[250px]">
                  {role.app === "instagram" ? (
                    <InstagramFeed slides={role.slides} index={slide} />
                  ) : (
                    <ThreadsFeed slides={role.slides} index={slide} />
                  )}
                </PhoneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
