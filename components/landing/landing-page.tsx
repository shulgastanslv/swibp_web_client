"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  GalleryHorizontalEnd,
  Layers3,
  Menu,
  PenLine,
  Share2,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import {
  IconArrowRight,
  IconBrandFigma,
  IconLayersSubtract,
  IconPhoto,
  IconTemplate,
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
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { LampContainer } from "@/components/ui/lamp";
import { Highlight } from "@/components/ui/hero-highlight";
import { WobbleCard } from "@/components/ui/wobble-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HeroStage } from "@/components/landing/hero-stage";

const NAV = [
  {
    name: "Возможности",
    link: "#features",
    icon: <SwatchBook className="size-4" />,
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
  "Серии",
];

const CARE = [
  {
    value: "presets",
    title: "Редакционные пресеты",
    body: "Обложки с готовой иерархией: бейдж, заголовок, плашка, воздух. Меняете слова — каркас серии остаётся.",
  },
  {
    value: "layers",
    title: "Слои без путаницы",
    body: "Порядок, z-index и подписи объектов живут в боковой панели. Текст, фото и фигуры не теряются друг под другом.",
  },
  {
    value: "figma",
    title: "Импорт из Figma",
    body: "Если макет уже собран в Figma, его можно забрать в студию и довести серию на холсте.",
  },
  {
    value: "preview",
    title: "Превью перед публикацией",
    body: "Пролистайте слайды так, как их увидят в ленте, и только потом забирайте файлы.",
  },
  {
    value: "export",
    title: "PNG и JSON",
    body: "Рендер без потери резкости и копия структуры слайда в буфер — если серию нужно повторить или отдать.",
  },
];

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="relative">
      <FloatingNav navItems={NAV} ctaHref="/studio" ctaLabel="Студия" />
      <AuthModal isOpen={authOpen} onOpenChange={setAuthOpen} />

      <section className="relative overflow-hidden bg-[#2f5bff] text-white">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <BackgroundBeams className="opacity-60" />
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Swibp">
            <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-white">
              <Logo width={36} height={36} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">swibp</span>
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

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-10 lg:pb-36">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              <Sparkles className="size-3.5" />
              Студия каруселей
            </p>
            <h1 className="mt-5 max-w-xl text-[2.7rem] leading-[0.95] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Ваши карусели.
              <br />
              Без ручной вёрстки.
            </h1>
            <TextGenerateEffect
              words="Пресеты, слои и экспорт в одном холсте."
              duration={0.35}
              className="text-lg font-medium text-white/90 sm:text-2xl"
              spanClassName="text-white/90"
            />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Собирайте серии для Instagram, LinkedIn и Telegram так, чтобы
              кадры держали один ритм — от обложки до финала.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-[#1a2f86] hover:bg-white/90"
              >
                <Link href="/studio">
                  Начать серию
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

      <div className="relative z-20 mx-auto -mt-16 grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-2">
        <article className="rounded-[1.7rem] bg-white p-6 shadow-[0_20px_60px_rgba(28,32,58,0.08)] sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-[#6d4aff]">
            Холст
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Вёрстка, которая не разъезжается
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c6170]">
            Редакционная типографика уже стоит на слайде. Вы правите смысл, а
            сетка серии остаётся собранной.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f4f2fb] p-4">
              <p className="text-3xl font-extrabold tracking-tight">1080</p>
              <p className="mt-1 text-xs text-[#5c6170]">сторона кадра</p>
            </div>
            <div className="rounded-2xl bg-[#f4f2fb] p-4">
              <p className="text-3xl font-extrabold tracking-tight">PNG</p>
              <p className="mt-1 text-xs text-[#5c6170]">и JSON рядом</p>
            </div>
          </div>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#2f5bff]"
          >
            Открыть холст
            <IconArrowRight className="size-4" />
          </Link>
        </article>

        <article className="relative overflow-hidden rounded-[1.7rem] bg-[#17181f] p-6 text-white shadow-[0_20px_60px_rgba(28,32,58,0.12)] sm:p-8">
          <div className="absolute -top-16 -right-10 size-56 rounded-full bg-[#6d4aff]/40 blur-3xl" />
          <p className="relative text-xs font-semibold tracking-wide text-[#c9b6ff]">
            Серия
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
          Серии, которые уезжают в ленту
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
            Всё, из чего собирается серия
          </h2>
        </div>
        <BentoGrid className="mt-8 md:auto-rows-[19rem]">
          <BentoGridItem
            className="md:col-span-2 bg-white"
            icon={<IconTemplate className="size-5 text-[#2f5bff]" />}
            title="Библиотека пресетов"
            description="Обложки и внутренние слайды с типографикой, которую не нужно собирать с нуля."
            header={<PresetHeader />}
          />
          <BentoGridItem
            className="bg-white"
            icon={<IconLayersSubtract className="size-5 text-[#6d4aff]" />}
            title="Слои"
            description="Порядок объектов, подписи и z-index — в одной панели."
            header={<LayersHeader />}
          />
          <BentoGridItem
            className="bg-white"
            icon={<IconBrandFigma className="size-5 text-[#2f5bff]" />}
            title="Импорт из Figma"
            description="Заберите макет и доведите серию уже в студии."
            header={<FigmaHeader />}
          />
          <BentoGridItem
            className="md:col-span-2 bg-white"
            icon={<IconPhoto className="size-5 text-[#6d4aff]" />}
            title="Превью и экспорт"
            description="Пролистайте кадры и заберите PNG без мыла или JSON структуры слайда."
            header={<ExportHeader />}
          />
        </BentoGrid>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <HoverEffect
          items={[
            {
              title: "Иконки и фильтры",
              description:
                "Знаки, плашки и обработка фото живут рядом с холстом — не в пяти разных окнах.",
              link: "#icons",
            },
            {
              title: "Фон и элементы",
              description:
                "Фигуры, текст и фон собираются в кадр с тем же ритмом, что и обложка.",
              link: "#elements",
            },
            {
              title: "Проекты в аккаунте",
              description:
                "Серии можно сохранять, возвращаться к ним и не держать единственный файл на столе.",
              link: "#projects",
            },
          ]}
        />
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[#6d4aff]">Студия</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Рутину заберёт холст
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5c6170] sm:text-base">
            Swibp не рисует за вас мысль. Он держит сетку, слои и экспорт, чтобы
            серия выглядела как одна история.
          </p>
          <Accordion
            type="single"
            collapsible
            defaultValue="presets"
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
                title: "Откройте пресет",
                text: "Возьмите обложку или пустой кадр. Иерархия текста уже стоит.",
              },
              {
                n: "02",
                title: "Соберите слайды",
                text: "Меняйте слова, фото, иконки и порядок слоёв. Серия остаётся в одном стиле.",
              },
              {
                n: "03",
                title: "Заберите файлы",
                text: "Превью, PNG без потери резкости и JSON, если структуру нужно сохранить.",
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
              <p className="text-sm font-semibold text-white/80">Студия открыта</p>
              <p className="mt-3 max-w-xs text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Начните серию сегодня
              </p>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                Холст, пресеты и экспорт — в одном окне. Аккаунт нужен, только
                чтобы сохранить проект.
              </p>
            </div>
            <Link
              href="/studio"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#3a2a78]"
            >
              Открыть студию
              <ArrowUpRight className="size-4" />
            </Link>
          </WobbleCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackgroundGradient containerClassName="rounded-[2rem]" className="rounded-[1.9rem] bg-[#f7f4ff] p-6 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold text-[#6d4aff]">Карусель</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Серия, которую не стыдно листать
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5c6170] sm:text-base">
                Обложка задаёт тон, середина держит мысль, финал оставляет
                действие. Всё это — отдельные слайды одного проекта.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <StatPill value="1080×1350" label="кадр" />
                <StatPill value="PNG" label="рендер" />
                <StatPill value="JSON" label="структура" />
              </div>
            </div>
            <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
              <img
                src="/landing/cover-editorial.svg"
                alt="Пресет обложки с крупной типографикой"
                className="h-full rounded-3xl object-cover shadow-lg"
              />
              <div className="grid gap-3">
                <img
                  src="/landing/cover-list.svg"
                  alt="Слайд со списком правил обложки"
                  className="rounded-3xl object-cover shadow-lg"
                />
                <div className="rounded-3xl bg-[#14151c] p-4 text-white">
                  <p className="text-3xl font-extrabold">+ JSON</p>
                  <p className="mt-1 text-xs text-white/70">
                    Структура слайда копируется в буфер
                  </p>
                </div>
              </div>
            </div>
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
          <AnimatedTestimonials
            autoplay
            testimonials={[
              {
                quote:
                  "Обложка больше не собирается час. Беру пресет, меняю заголовок и сразу вижу, держит ли кадр ритм.",
                name: "Алина Морозова",
                designation: "Редактор",
                src: "/landing/cover-editorial.svg",
              },
              {
                quote:
                  "Серия для LinkedIn наконец выглядит как одна история, а не как три случайных картинки из разных файлов.",
                name: "Илья Сергеев",
                designation: "Основатель",
                src: "/landing/cover-list.svg",
              },
              {
                quote:
                  "Экспорт резкий, а JSON спасает, когда нужно повторить структуру слайда без ручного копирования слоёв.",
                name: "Марина Коваль",
                designation: "Дизайнер",
                src: "/landing/cover-stat.svg",
              },
            ]}
          />
          <InfiniteMovingCards
            speed="slow"
            items={[
              {
                quote:
                  "Слои подписаны, z-index не приходится угадывать. Это и есть нормальная студия, а не доска.",
                name: "Кирилл",
                title: "Арт-директор",
              },
              {
                quote:
                  "Превью перед выгрузкой убирает половину правок. Листаешь серию так же, как её увидят.",
                name: "Софья",
                title: "SMM",
              },
              {
                quote:
                  "Иконки и фон рядом с холстом. Не ухожу в другой инструмент ради одной плашки.",
                name: "Денис",
                title: "Продюсер",
              },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6">
        <LampContainer>
          <motion.h2
            initial={{ opacity: 0.5, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            Первая серия — сегодня
          </motion.h2>
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-slate-300 sm:text-base">
            Откройте студию, возьмите пресет и соберите кадры, которые можно
            сразу ставить в ленту.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950"
            >
              Открыть студию
            </Link>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
            >
              Войти
            </button>
          </div>
        </LampContainer>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[2rem] bg-[#ddd4ff] px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Уже внутри студии
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#3c345c] sm:text-base">
            Пресеты с типографикой, резкий рендер и копирование JSON — то, с чем
            можно работать прямо сейчас.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { href: "#features", label: "Пресеты", icon: GalleryHorizontalEnd },
              { href: "#how", label: "Слои", icon: Layers3 },
              { href: "/studio", label: "Холст", icon: Share2 },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="grid size-14 place-items-center rounded-full bg-white text-[#14151c] shadow-sm"
                aria-label={item.label}
              >
                <item.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0e0f14] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-white">
                <Logo width={36} height={36} />
              </span>
              <span className="text-lg font-extrabold">swibp</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Студия каруселей: пресеты, слои и экспорт в одном холсте.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/40">Продукт</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#features" className="text-white/80 hover:text-white">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#how" className="text-white/80 hover:text-white">
                  Как это работает
                </a>
              </li>
              <li>
                <Link href="/studio" className="text-white/80 hover:text-white">
                  Студия
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/40">Аккаунт</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="text-white/80 hover:text-white"
                >
                  Войти
                </button>
              </li>
              <li>
                <a href="#stories" className="text-white/80 hover:text-white">
                  Отзывы
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/40 sm:px-6">
            © {new Date().getFullYear()} Swibp
          </p>
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

function PresetHeader() {
  return (
    <div className="flex h-full min-h-28 gap-3 rounded-xl bg-[#f4f2fb] p-3">
      <div className="flex-1 rounded-lg bg-[#f6f1e8] p-3">
        <p className="font-serif text-lg leading-none text-[#161513]">Обложка</p>
        <div className="mt-3 h-6 w-2/3 rounded-md bg-[#2f5bff]" />
      </div>
      <div className="flex-1 rounded-lg bg-[#14151c] p-3 text-white">
        <p className="text-sm font-bold">Слайд</p>
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 rounded-full bg-white/50" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function LayersHeader() {
  return (
    <div className="flex h-full min-h-28 flex-col justify-center gap-2 rounded-xl bg-[#f4f2fb] p-4">
      {["Заголовок", "Фото", "Плашка"].map((layer, index) => (
        <div
          key={layer}
          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs"
        >
          <span>{layer}</span>
          <span className="text-[#8b90a0]">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function FigmaHeader() {
  return (
    <div className="grid h-full min-h-28 place-items-center rounded-xl bg-gradient-to-br from-[#fff1ee] to-[#efe9ff]">
      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm">
        Figma → холст
      </div>
    </div>
  );
}

function ExportHeader() {
  return (
    <div className="flex h-full min-h-28 items-end gap-3 rounded-xl bg-[#14151c] p-4">
      <div className="rounded-xl bg-[#2f5bff] px-4 py-3 text-white">
        <p className="text-2xl font-extrabold">PNG</p>
        <p className="text-[11px] text-white/80">резкий рендер</p>
      </div>
      <div className="rounded-xl bg-white px-4 py-3 text-[#14151c]">
        <p className="text-2xl font-extrabold">JSON</p>
        <p className="text-[11px] text-[#6b7080]">структура слайда</p>
      </div>
    </div>
  );
}

function CareVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-6 rounded-full bg-[#e7deff]" />
      <div className="absolute inset-0 grid place-items-center">
        <img
          src="/landing/cover-editorial.svg"
          alt="Пример слайда в студии"
          className="w-[62%] rounded-[1.6rem] shadow-2xl"
        />
      </div>
      <div className="absolute top-8 right-0 rounded-2xl bg-white px-3 py-2 text-xs font-semibold shadow-lg">
        Превью ленты
      </div>
      <div className="absolute bottom-10 left-0 rounded-2xl bg-[#14151c] px-3 py-2 text-xs font-semibold text-white shadow-lg">
        Слой: заголовок
      </div>
      <div className="absolute right-4 bottom-6 rounded-full bg-[#2f5bff] px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg">
        Экспорт
      </div>
    </div>
  );
}
