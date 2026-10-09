"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Menu,
  PenLine,
  Shapes,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import {
  IconArrowRight,
  IconBolt,
  IconCamera,
  IconChartBar,
  IconHeart,
  IconLayersSubtract,
  IconLeaf,
  IconMessageCircle,
  IconPhoto,
  IconRocket,
  IconSparkles,
  IconStar,
  IconSun,
} from "@tabler/icons-react";

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
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Highlight } from "@/components/ui/hero-highlight";
import { WobbleCard } from "@/components/ui/wobble-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HeroStage } from "@/components/landing/hero-stage";
import { CoverClose, CoverHook, CoverList } from "@/components/landing/covers";

const NAV = [
  {
    name: "Возможности",
    link: "#features",
    icon: <SwatchBook className="size-4" />,
  },
  {
    name: "Иконки",
    link: "#icons",
    icon: <Shapes className="size-4" />,
  },
  {
    name: "Как это работает",
    link: "#how",
    icon: <Sparkles className="size-4" />,
  },
  {
    name: "Отзывы",
    link: "#stories",
    icon: <PenLine className="size-4" />,
  },
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

const ICON_SET = [
  IconSparkles,
  IconHeart,
  IconRocket,
  IconStar,
  IconBolt,
  IconSun,
  IconChartBar,
  IconMessageCircle,
  IconCamera,
  IconLeaf,
  IconPhoto,
  IconLayersSubtract,
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
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              <Sparkles className="size-3.5" />
              ИИ для каруселей
            </p>
            <h1 className="mt-3 max-w-xl text-[2.7rem] leading-[0.95] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
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
                <Link href="/studio">
                  Создать карусель
                  <ArrowUpRight />
                </Link>
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
          <p className="text-xs font-semibold tracking-wide text-[#6d4aff]">
            Генерация
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Карусель создаётся из описания
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c6170]">
            Тема, тон и адресат. ИИ раскладывает мысль по кадрам и держит один голос от обложки до финала.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f4f2fb] px-4 py-3">
            <p className="text-[11px] font-semibold tracking-wide text-[#6d4aff]">Промпт</p>
            <p className="mt-1 text-sm leading-snug">
              «Объясни карусель за шесть кадров. Спокойно, для редакторов, без жаргона.»
            </p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-[#f4efe6] p-3">
              <p className="font-extrabold">01</p>
              <p className="mt-1 text-[#5c6170]">Крючок</p>
            </div>
            <div className="rounded-xl bg-[#14151c] p-3 text-white">
              <p className="font-extrabold">02–05</p>
              <p className="mt-1 text-white/70">Аргументы</p>
            </div>
            <div className="rounded-xl bg-[#e7deff] p-3">
              <p className="font-extrabold">06</p>
              <p className="mt-1 text-[#5c6170]">Действие</p>
            </div>
          </div>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#2f5bff]"
          >
            Создать карусель
            <IconArrowRight className="size-4" />
          </Link>
        </article>

        <article className="relative overflow-hidden rounded-[1.7rem] bg-[#17181f] p-6 text-white shadow-[0_20px_60px_rgba(28,32,58,0.12)] sm:p-8">
          <div className="absolute -top-16 -right-10 size-56 rounded-full bg-[#6d4aff]/40 blur-3xl" />
          <p className="relative text-xs font-semibold tracking-wide text-[#c9b6ff]">
            Карусель
          </p>
          <h2 className="relative mt-2 max-w-xs text-2xl font-extrabold tracking-tight sm:text-3xl">
            Один стиль на все слайды
          </h2>
          <div className="relative mt-6 flex gap-3">
            <div className="w-28 shrink-0 rounded-2xl bg-[#f6f1e8] p-3 text-[#161513]">
              <p className="font-serif text-lg leading-none">Обложка</p>
              <div className="mt-4 h-10 rounded-lg bg-[#2f5bff]" />
            </div>
            <div className="w-28 shrink-0 rounded-2xl bg-white/10 p-3">
              <p className="text-sm font-bold">Слайд 02</p>
              <div className="mt-4 space-y-1.5">
                <div className="h-2 rounded-full bg-white/40" />
                <div className="h-2 w-2/3 rounded-full bg-white/25" />
              </div>
            </div>
            <div className="w-28 shrink-0 rounded-2xl bg-[#6d4aff] p-3">
              <p className="text-sm font-bold">Финал</p>
              <p className="mt-6 text-xs text-white/80">Призыв и ссылка</p>
            </div>
          </div>
        </article>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-center text-sm font-medium text-[#6b7080]">
          Карусели, которые уезжают в ленту
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
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

      <section id="features" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#6d4aff]">Возможности</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            От промпта до готовой карусели
          </h2>
        </div>
        <BentoGrid className="mt-8 md:auto-rows-[19rem]">
          <BentoGridItem
            className="md:col-span-2 bg-white"
            icon={<IconSparkles className="size-5 text-[#2f5bff]" />}
            title="Из одного текста"
            description="Промпт превращается в план кадров. ИИ сам назначает обложке крючок, середине аргументы, финалу действие."
            header={<PromptHeader />}
          />
          <BentoGridItem
            className="bg-white"
            icon={<IconLayersSubtract className="size-5 text-[#6d4aff]" />}
            title="Один голос"
            description="Тон, обращение и сила обещания не прыгают от слайда к слайду."
            header={<ToneHeader />}
          />
          <BentoGridItem
            className="md:col-span-3 bg-white"
            icon={<IconPhoto className="size-5 text-[#6d4aff]" />}
            title="Крючок, объяснение, действие"
            description="Генерация не отдаёт один постер. Карусель читается по порядку: первый кадр останавливает ленту, середина раскрывает мысль, финал оставляет следующий шаг."
            header={<SeriesHeader />}
          />
        </BentoGrid>
      </section>

      <section id="icons" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-[#14151c] text-white">
          <div className="grid items-end gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-white/45 uppercase">
                Библиотека
              </p>
              <h2 className="mt-4 text-6xl leading-none font-extrabold tracking-tighter sm:text-8xl">
                14<span className="text-[#c9b6ff]">млн</span>
              </h2>
              <p className="mt-3 text-lg font-medium text-white/85">иконок в студии</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Поиск открыт рядом с холстом. Знак встаёт на кадр и остаётся в том же ритме, что и карусель.
              </p>
              <Link
                href="/studio"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#14151c]"
              >
                Открыть библиотеку
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ICON_SET.map((Icon, index) => (
                <span
                  key={index}
                  className="grid aspect-square place-items-center rounded-2xl bg-white/10 text-white"
                >
                  <Icon className="size-6" stroke={1.5} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[#6d4aff]">Генерация</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
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
        <p className="text-sm font-semibold text-[#6d4aff]">Три шага</p>
        <h2 className="mt-3 max-w-3xl text-5xl font-extrabold tracking-tight text-[#14151c] sm:text-6xl lg:text-7xl">
          Как это <Highlight className="text-[#14151c]">работает</Highlight>
        </h2>
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ol className="grid gap-4">
            {[
              {
                n: "01",
                title: "Опишите тему",
                text: "Пара предложений: о чём карусель, для кого и какой тон. Этого достаточно, чтобы начать.",
              },
              {
                n: "02",
                title: "ИИ раскладывает мысль",
                text: "Обложка получает крючок, середина — аргументы, финал — действие. Голос на всех кадрах один.",
              },
              {
                n: "03",
                title: "Поправьте и заберите",
                text: "Уточните формулировки. Карусель уже собрана, кадры не нужно собирать заново.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="flex gap-4 rounded-[1.4rem] bg-white p-5 shadow-[0_10px_40px_rgba(28,32,58,0.05)]"
              >
                <span className="text-sm font-bold text-[#6d4aff]">{step.n}</span>
                <span>
                  <span className="block text-lg font-bold">{step.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-[#5c6170]">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <WobbleCard
            containerClassName="bg-[#6d4aff] min-h-[320px]"
            className="flex h-full flex-col justify-between py-10"
          >
            <div>
              <p className="text-sm font-semibold text-white/80">Пример промпта</p>
              <p className="mt-3 max-w-xs text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                «Спокойно объясни, зачем нужна карусель»
              </p>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                ИИ отдаёт шесть кадров одним голосом: крючок, аргументы и финал. Проект сохраняется в аккаунте.
              </p>
            </div>
            <Link
              href="/studio"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#3a2a78]"
            >
              Создать карусель
              <ArrowUpRight className="size-4" />
            </Link>
          </WobbleCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackgroundGradient containerClassName="rounded-[2rem]" className="rounded-[1.9rem] bg-[#f7f4ff] p-6 sm:p-10">
          <div>
            <p className="text-sm font-semibold text-[#6d4aff]">Карусель</p>
            <h2 className="mt-2 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Обложка, середина и финал
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5c6170] sm:text-base">
              Так выглядит созданная карусель. Обложка останавливает, середина объясняет, финал оставляет действие.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <StatPill value="1 промпт" label="на всю карусель" />
              <StatPill value="6 кадров" label="крючок, аргументы, финал" />
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            <CoverHook />
            <CoverList />
            <CoverClose />
          </div>
        </BackgroundGradient>
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
        <div className="rounded-[2rem] bg-[#ddd4ff] px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Опишите тему. Заберите карусель.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#3c345c] sm:text-base">
            ИИ создаст карусель. Вы поправите текст и скачаете кадры.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="inline-flex h-11 items-center rounded-full bg-[#14151c] px-5 text-sm font-semibold text-white"
            >
              Создать карусель
            </Link>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#14151c]"
            >
              Войти
            </button>
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

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-extrabold">{value}</p>
      <p className="text-[11px] text-[#6b7080]">{label}</p>
    </div>
  );
}

function PromptHeader() {
  return (
    <div className="flex h-full min-h-36 flex-col justify-between rounded-xl bg-[#14151c] p-4 text-white">
      <p className="text-[11px] font-semibold tracking-wide text-white/45">Промпт</p>
      <p className="text-sm leading-snug">
        Объясни карусель за 6 кадров. Спокойно, для редакторов, без жаргона.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold">обложка</span>
        <span className="rounded-lg bg-[#2f5bff] px-2 py-1 text-[11px] font-semibold">аргументы</span>
        <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-[#14151c]">финал</span>
      </div>
    </div>
  );
}

function ToneHeader() {
  const rows = [
    ["Тон", "спокойный"],
    ["Для кого", "редакция"],
    ["Голос", "один на все кадры"],
  ];

  return (
    <div className="flex h-full min-h-28 flex-col justify-center gap-2 rounded-xl bg-[#f4f2fb] p-4">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs"
        >
          <span className="text-[#8b90a0]">{label}</span>
          <span className="font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

function SeriesHeader() {
  const beats = [
    ["01", "Крючок", "Обещание, которое хочется открыть", "bg-[#f4efe6]"],
    ["02–05", "Объяснение", "Мысль по шагам, один ритм", "bg-white"],
    ["06", "Действие", "Что сделать после последнего кадра", "bg-[#e7deff]"],
  ];

  return (
    <div className="grid h-full min-h-28 gap-2 rounded-xl bg-[#f4f2fb] p-3 sm:grid-cols-3">
      {beats.map(([n, title, text, tone]) => (
        <div key={n} className={`rounded-xl p-3 ${tone}`}>
          <p className="text-[11px] font-semibold text-[#6d4aff]">{n}</p>
          <p className="mt-1 text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#5c6170]">{text}</p>
        </div>
      ))}
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
      <div className="absolute top-8 right-0 rounded-2xl bg-white px-3 py-2 text-xs font-semibold shadow-lg">
        Тон: спокойный
      </div>
      <div className="absolute bottom-10 left-0 rounded-2xl bg-[#14151c] px-3 py-2 text-xs font-semibold text-white shadow-lg">
        Кадр 01 · крючок
      </div>
      <div className="absolute right-4 bottom-6 rounded-full bg-[#2f5bff] px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg">
        Черновик
      </div>
    </div>
  );
}
