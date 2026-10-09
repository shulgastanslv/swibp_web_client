"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";

import Logo from "@/components/logo";
import { AuthModal } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Highlight } from "@/components/ui/hero-highlight";
import { HeroStage, PhoneFrame } from "@/components/landing/hero-stage";
import { CoverClose, CoverHook, CoverList } from "@/components/landing/covers";

const NAV = [
  { name: "Возможности", link: "#features" },
  { name: "Редактор", link: "#editor" },
  { name: "Иконки", link: "#icons" },
  { name: "Как это работает", link: "#how" },
  { name: "Отзывы", link: "#stories" },
];

const PALETTE = [
  "#0a0a0a",
  "#f5f1ea",
  "#1e3a5f",
  "#4c1d95",
  "#2563eb",
  "#0d9488",
  "#db2777",
  "#fde68a",
];

const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "Telegram",
  "Threads",
  "Pinterest",
  "Карусели",
  "Обложки",
  "Создание каруселей",
];

const CARE = [
  {
    value: "prompt",
    title: "Тема, тон и адресат",
    body: "Пары предложений достаточно: о чём карусель, кому она и как звучит. Макет описывать не нужно.",
  },
  {
    value: "hook",
    title: "Обложка с крючком",
    body: "Первый кадр останавливает ленту. Обещание короткое, его хочется открыть.",
  },
  {
    value: "middle",
    title: "Середина объясняет",
    body: "Следующие слайды раскрывают мысль по шагам. Нумерация и ритм уже стоят на месте.",
  },
  {
    value: "close",
    title: "Финал оставляет действие",
    body: "Последний кадр не повторяет обложку. Он говорит, что сделать дальше.",
  },
];

const STORIES = [
  {
    quote:
      "Написала тему в два предложения и получила шесть кадров. Обложка уже держала ритм, я только уточнила формулировки.",
    name: "Алина Морозова",
    role: "Редактор",
    cover: <CoverHook />,
  },
  {
    quote:
      "Раньше карусель разъезжалась между файлами. Теперь она создаётся сразу: обложка, список, финал — один стиль.",
    name: "Илья Сергеев",
    role: "Основатель",
    cover: <CoverList />,
  },
  {
    quote:
      "ИИ закрывает черновик карусели. Формулировку ставлю сам и не собираю кадры с нуля.",
    name: "Марина Коваль",
    role: "Дизайнер",
    cover: <CoverClose />,
  },
];

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [story, setStory] = useState(0);
  const activeStory = STORIES[story];

  return (
    <div className="relative">
      <FloatingNav navItems={NAV} ctaHref="/studio" ctaLabel="Студия" />
      <AuthModal isOpen={authOpen} onOpenChange={setAuthOpen} />

      <section className="relative overflow-hidden bg-[#2f5bff] text-white">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <BackgroundBeams className="opacity-60" />
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="grid size-9 place-items-center overflow-hidden rounded-xl bg-white" aria-label="Swibp">
            <Logo width={36} height={36} />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/85 md:flex">
            {NAV.map((item) => (
              <a key={item.link} href={item.link} className="hover:text-white">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden h-10 rounded-full px-4 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() => setAuthOpen(true)}
            >
              Войти
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-white px-4 text-[#1a2f86] hover:bg-white/90"
            >
              <Link href="/studio">Открыть студию</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white md:hidden"
                  aria-label="Меню"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,20rem)]">
                <SheetHeader>
                  <SheetTitle>Swibp</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  {NAV.map((item) => (
                    <SheetClose asChild key={item.link}>
                      <a
                        href={item.link}
                        className="rounded-xl px-3 py-3 text-base font-medium"
                      >
                        {item.name}
                      </a>
                    </SheetClose>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 rounded-full"
                    onClick={() => setAuthOpen(true)}
                  >
                    Войти
                  </Button>
                  <Button asChild className="h-10 rounded-full">
                    <Link href="/studio">Открыть студию</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-5 lg:pb-20">
          <div>
            <h1 className="max-w-xl text-[2.7rem] leading-[0.95] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Карусель
              <br />
              из одной мысли.
            </h1>
            <TextGenerateEffect
              words="Опишите тему. ИИ создаст карусель."
              duration={0.35}
              className="text-lg font-medium text-white/90 sm:text-2xl"
              spanClassName="text-white/90"
            />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Модель сама решает, что стоит на обложке, чем объяснять середину и чем
              закончить. Вы правите формулировки, а не собираете каждый кадр с нуля.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-[#1a2f86] hover:bg-white/90"
              >
                <Link href="/studio">Создать карусель</Link>
              </Button>
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm font-medium text-white hover:bg-white/10"
              >
                Как это устроено
              </a>
            </div>
          </div>
          <HeroStage />
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-10 grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-2">
        <article className="rounded-[1.7rem] bg-white p-6 shadow-[0_20px_60px_rgba(28,32,58,0.08)] sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Карусель создаётся из описания
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c6170] sm:text-base">
            Тема, тон и адресат. ИИ раскладывает мысль по кадрам и держит один голос от обложки до финала.
          </p>
          <p className="mt-8 text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
            «Объясни карусель за шесть кадров. Спокойно, для редакторов, без жаргона.»
          </p>
          <Link
            href="/studio"
            className="mt-8 inline-flex text-sm font-semibold text-[#2f5bff]"
          >
            Создать карусель
          </Link>
        </article>

        <article className="relative min-h-[360px] overflow-hidden rounded-[1.7rem] text-white shadow-[0_20px_60px_rgba(28,32,58,0.12)]">
          <img
            src="/landing/slide-cover.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6 sm:p-8">
            <h2 className="max-w-xs text-2xl font-extrabold tracking-tight sm:text-3xl">
              Один стиль на все слайды
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
              Обложка, середина и финал звучат одинаково.
            </p>
          </div>
        </article>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...PLATFORMS, ...PLATFORMS].map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="text-2xl font-extrabold tracking-tight text-[#14151c]/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          От промпта до готовой карусели
        </h2>
        <div className="mt-10 overflow-hidden rounded-[1.7rem] bg-white shadow-[0_10px_40px_rgba(28,32,58,0.05)]">
          <div className="grid divide-y divide-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              [
                "Из одного текста",
                "Промпт становится планом кадров. Обложка получает крючок, середина — аргументы, финал — действие.",
              ],
              [
                "Один голос",
                "Тон, обращение и сила обещания не прыгают от слайда к слайду.",
              ],
              [
                "Крючок, объяснение, действие",
                "Первый кадр останавливает ленту, середина раскрывает мысль, финал оставляет следующий шаг.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="p-6 sm:p-8">
                <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#5c6170]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="editor" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.7rem] bg-white p-8 sm:p-10 lg:col-span-2">
            <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Удобный редактор
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5c6170]">
              Черновик открывается на холсте. Текст, фото и плашки правятся в том же кадре, карусель не разъезжается по файлам.
            </p>
          </article>

          <article className="rounded-[1.7rem] bg-[#f6f1e8] p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Шаблоны</h2>
            <ul className="mt-8 space-y-3 text-2xl font-semibold tracking-tight">
              <li>Журнальная обложка</li>
              <li>Сетка с материалами</li>
              <li>Мудборд</li>
            </ul>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-[#5c6170]">
              Каркас уже стоит. Меняете слова, ритм слайда остаётся.
            </p>
          </article>

          <article className="rounded-[1.7rem] bg-white p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Палитры</h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {PALETTE.map((color) => (
                <span
                  key={color}
                  className="size-11 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div
                className="h-16 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #f8f7f4, #c9b79c)" }}
              />
              <div
                className="h-16 rounded-2xl"
                style={{ background: "radial-gradient(circle at center, #e0e7ff, #1e1b4b)" }}
              />
            </div>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[#5c6170]">
              Сплошной цвет, линейный и радиальный градиент или свой оттенок на весь слайд.
            </p>
          </article>
        </div>
      </section>

      <section id="icons" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-[2rem] bg-[#14151c] px-6 py-12 text-white sm:px-12 sm:py-16">
          <h2 className="text-6xl leading-none font-extrabold tracking-tighter sm:text-8xl">
            14<span className="text-[#c9b6ff]"> млн</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            иконок в студии. Поиск рядом с холстом, знак встаёт на кадр и остаётся в том же ритме, что и карусель.
          </p>
          <Link
            href="/studio"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#14151c]"
          >
            Открыть библиотеку
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Как ИИ создаёт карусель
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5c6170] sm:text-base">
            Вы приносите тему. Модель раскладывает её по кадрам и оставляет текст, который можно поправить.
          </p>
          <Accordion
            type="single"
            collapsible
            defaultValue="prompt"
            className="mt-6"
          >
            {CARE.map((item) => (
              <AccordionItem key={item.value} value={item.value} className="border-black/10">
                <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-[#5c6170]">
                  {item.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <CareVisual />
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="max-w-3xl text-5xl font-extrabold tracking-tight text-[#14151c] sm:text-6xl lg:text-7xl">
          Как это <Highlight className="text-[#14151c]">работает</Highlight>
        </h2>
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ol className="divide-y divide-black/10 border-y border-black/10">
            {[
              {
                title: "Опишите тему",
                text: "Пара предложений: о чём карусель, для кого и какой тон. Этого достаточно, чтобы начать.",
              },
              {
                title: "ИИ раскладывает мысль",
                text: "Обложка получает крючок, середина — аргументы, финал — действие. Голос на всех кадрах один.",
              },
              {
                title: "Поправьте и заберите",
                text: "Уточните формулировки. Карусель уже собрана, кадры не нужно собирать заново.",
              },
            ].map((step) => (
              <li key={step.title} className="py-6">
                <h3 className="text-2xl font-extrabold tracking-tight">{step.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5c6170] sm:text-base">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
          <div className="flex min-h-[320px] flex-col justify-between rounded-[1.7rem] bg-[#6d4aff] p-8 text-white sm:p-10">
            <p className="max-w-xs text-3xl font-extrabold tracking-tight sm:text-4xl">
              «Спокойно объясни, зачем нужна карусель»
            </p>
            <div>
              <p className="max-w-sm text-sm leading-relaxed text-white/80">
                Шесть кадров одним голосом. Проект сохраняется в аккаунте.
              </p>
              <Link
                href="/studio"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#3a2a78]"
              >
                Создать карусель
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div>
          <h2 className="max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Обложка, середина и финал
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5c6170] sm:text-base">
            Так выглядит созданная карусель. Обложка останавливает, середина объясняет, финал оставляет действие.
          </p>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            <CoverHook />
            <CoverList />
            <CoverClose />
          </div>
        </div>
      </section>

      <section id="stories" className="relative overflow-hidden py-16">
        <p
          aria-hidden
          className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 text-[18vw] leading-none font-extrabold tracking-tighter text-[#14151c]/[0.04] select-none"
        >
          Отзывы
        </p>
        <div className="relative">
          <h2 className="px-4 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Как это звучит в работе
          </h2>
          <div className="mx-auto mt-10 grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="mx-auto w-full max-w-[440px]">{activeStory.cover}</div>
            <div>
              <p className="text-2xl leading-snug font-semibold tracking-tight text-[#14151c] sm:text-3xl">
                {activeStory.quote}
              </p>
              <p className="mt-6 text-base font-bold">{activeStory.name}</p>
              <p className="text-sm text-[#5c6170]">{activeStory.role}</p>
              <div className="mt-8 flex gap-2">
                <button
                  type="button"
                  aria-label="Предыдущий отзыв"
                  onClick={() => setStory((index) => (index + STORIES.length - 1) % STORIES.length)}
                  className="grid size-10 place-items-center rounded-full bg-white text-[#14151c] shadow-sm"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Следующий отзыв"
                  onClick={() => setStory((index) => (index + 1) % STORIES.length)}
                  className="grid size-10 place-items-center rounded-full bg-[#14151c] text-white"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
          <InfiniteMovingCards
            speed="slow"
            items={[
              {
                quote:
                  "Описала рубрику одним абзацем. Вернулась к готовой карусели, а не к пустому холсту.",
                name: "Кирилл",
                title: "Арт-директор",
              },
              {
                quote:
                  "Слайды нумеруются и читаются по порядку. Это именно лента, а не набор отдельных картинок.",
                name: "Софья",
                title: "SMM",
              },
              {
                quote:
                  "Черновик от ИИ можно разобрать по слоям и поправить заголовок, не ломая остальные кадры.",
                name: "Денис",
                title: "Продюсер",
              },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#07111f] text-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-6 py-12 sm:px-12 sm:py-16">
            <h2 className="max-w-md text-4xl font-extrabold tracking-tight sm:text-5xl">
              Опишите тему. Заберите карусель.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              ИИ создаст карусель. Вы поправите текст и скачаете кадры.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/studio"
                className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#14151c]"
              >
                Создать карусель
              </Link>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
              >
                Войти
              </button>
            </div>
          </div>
          <div className="flex items-end justify-center bg-[#2f5bff] px-6 pt-10">
            <div className="w-[240px] translate-y-8 rotate-6 sm:w-[280px]">
              <PhoneFrame>
                <CoverClose />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            swibp
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5c6170]">
            <a href="#features" className="hover:text-[#14151c]">
              Возможности
            </a>
            <a href="#editor" className="hover:text-[#14151c]">
              Редактор
            </a>
            <a href="#icons" className="hover:text-[#14151c]">
              Иконки
            </a>
            <a href="#how" className="hover:text-[#14151c]">
              Как это работает
            </a>
          </nav>
          <p className="text-xs text-[#8b90a0]">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

function CareVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-6 rounded-full bg-[#e7deff]" />
      <div className="absolute inset-x-[12%] inset-y-[8%]">
        <CoverHook />
      </div>
    </div>
  );
}
