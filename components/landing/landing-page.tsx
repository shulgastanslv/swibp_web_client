"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Menu } from "lucide-react";

import { WhiteLogo } from "@/components/logo";
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
import { HeroStage } from "@/components/landing/hero-stage";
import { AudienceBlock } from "@/components/landing/audience-block";
import { Reveal } from "@/components/landing/reveal";
import {
  DualPhonesMock,
  EditorMock,
  ExportInline,
  IconsShowcase,
  PhoneCarouselMock,
  PromptInline,
  TemplatesPair,
} from "@/components/landing/landing-visuals";

const NAV = [
  { name: "Product", link: "#product" },
  { name: "Studio", link: "#studio" },
  { name: "Library", link: "#library" },
  { name: "FAQ", link: "#faq" },
];

const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "Telegram",
  "Threads",
  "X",
  "Pinterest",
];

const EDITOR_POINTS = [
  "Generate на холсте",
  "Слои и инспектор",
  "Навигатор слайдов",
  "Экспорт PNG / ZIP",
];
const FAQ = [
  {
    value: "what",
    q: "Что такое Swibp?",
    a: "Студия для каруселей: из темы собирается последовательность слайдов, дальше вы правите их на холсте и экспортируете кадры.",
  },
  {
    value: "how-gen",
    q: "Как работает генерация?",
    a: "Вы задаёте тему, число слайдов и стиль. Модель раскладывает мысль по кадрам и открывает результат сразу в редакторе — обложка, середина и финал уже на местах.",
  },
  {
    value: "edit",
    q: "Можно ли править после генерации?",
    a: "Да. Меняйте текст, фото, иконки, фоны и порядок слайдов. Генерация — старт, не финальный пост.",
  },
  {
    value: "vs-canva",
    q: "Чем это отличается от Canva?",
    a: "Canva начинается с пустого макета. Swibp сначала собирает смысл по кадрам, а визуал вы доводите в своей студии: слои, шаблоны, экспорт.",
  },
  {
    value: "templates",
    q: "Нужны ли шаблоны?",
    a: "Не обязательно. Можно генерировать с нуля или взять шаблон как каркас и переписать под свою тему.",
  },
  {
    value: "export",
    q: "Что я скачиваю?",
    a: "Отдельные кадры PNG/JPEG или архив ZIP. Удобно сразу выкладывать в Instagram, LinkedIn, Threads или Telegram.",
  },
  {
    value: "slides",
    q: "Сколько слайдов можно сделать?",
    a: "При генерации выбираете длину карусели. В редакторе слайды можно добавлять, дублировать и удалять.",
  },
  {
    value: "account",
    q: "Нужен ли аккаунт?",
    a: "Чтобы сохранять проекты и возвращаться к ним — да. Черновики остаются в аккаунте.",
  },
  {
    value: "lang",
    q: "На каком языке текст?",
    a: "Пишите тему на том языке, на котором нужна карусель. Редактор не привязан к одному языку.",
  },
  {
    value: "who",
    q: "Кому это подходит?",
    a: "SMM, основателям, редакторам, маркетологам — всем, кто регулярно объясняет мысль каруселью, а не одним квадратом.",
  },
];

function Layer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-6 max-w-2xl sm:mb-8">
      <p className="text-[13px] font-bold tracking-wide text-[#2f5bff]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-3 text-base leading-relaxed text-[#5c6170]">{text}</p>
      ) : null}
    </div>
  );
}

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="relative">
      <FloatingNav navItems={NAV} ctaHref="/studio" ctaLabel="Studio" />
      <AuthModal isOpen={authOpen} onOpenChange={setAuthOpen} />

      <section className="relative overflow-hidden bg-[#2f5bff] text-white">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <BackgroundBeams className="opacity-60" />
        <div className="relative z-10 mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

          <WhiteLogo width={36} height={36} />

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-white/85 md:flex">
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
              Sign In
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-white px-4 text-[#1a2f86] hover:bg-white/90"
            >
              <Link href="/studio">Open a studio</Link>
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

        <div className="relative z-10 mt-10 mx-auto grid max-w-6xl items-center gap-6 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-5 lg:pb-20">
          <div>
            <h1 className="max-w-xl text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Make carousel
              <br />
              from one idea.
            </h1>
            <TextGenerateEffect
              words="Describe your topic. AI will create the carousel."
              duration={0.35}
              className="text-lg font-medium text-white/90 sm:text-2xl"
              spanClassName="text-white/90"
            />
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/75 sm:text-base">
              The model itself decides what to put on the cover, why to explain the middle and
              why to finish. You fix the formulations, not collect each frame
              с нуля.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-[#1a2f86] hover:bg-white/90"
              >
                <Link href="/studio">Create carousel</Link>
              </Button>
              <a
                href="#product"
                className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-[13px] font-medium text-white hover:bg-white/10"
              >
                How it works
              </a>
            </div>
          </div>
          <HeroStage />
        </div>
      </section>

      {/* Opening composition — one pastel bento, no wireframe cards */}
      <section
        id="product"
        className="relative z-20 mx-auto -mt-14 max-w-6xl scroll-mt-24 px-4 sm:-mt-20 sm:px-6"
      >
        <Reveal>
          <div className="grid gap-3 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
            <Layer className="bg-[#fff4cc] p-6 sm:p-8 md:col-span-7 md:row-span-2 md:min-h-[480px]">
              <p className="text-[13px] font-bold text-[#8a7a3a]">#Generate</p>
              <h2 className="mt-3 max-w-sm text-3xl font-extrabold tracking-tight sm:text-4xl">
                Тема → карусель
              </h2>
              <p className="mt-3 max-w-xs text-[13px] text-[#5c6170]">
                Обложка, середина, финал — из пары предложений.
              </p>
              <div className="mt-8 flex justify-center md:mt-10">
              </div>
            </Layer>

            <Layer className="bg-[#e4ebff] p-0 md:col-span-5 md:min-h-[230px]">
              <div className="relative flex h-full min-h-[230px] items-end justify-center overflow-hidden px-4 pt-8">
                <div className="absolute inset-x-10 top-6 bottom-0 rounded-t-[2rem] bg-[#c9d4ff]" />
                <div className="relative z-10 translate-y-8">
                  <PhoneCarouselMock
                    app="instagram"
                    className="h-[280px] w-[140px] border-[5px] sm:h-[300px] sm:w-[150px]"
                  />
                </div>
                <p className="absolute top-5 left-5 z-10 text-[13px] font-bold text-[#3a4f9a]">
                  #Лента
                </p>
              </div>
            </Layer>

            <Layer className="bg-[#efe7ff] p-5 sm:p-6 md:col-span-5">
              <p className="text-[13px] font-bold text-[#6b5f9a]">#Студия</p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                Правите на холсте
              </h3>
              <div className="mt-4 origin-top scale-[0.85]">
                <EditorMock />
              </div>
            </Layer>

            <Layer className="bg-[#e5f6ea] p-5 sm:p-6 md:col-span-5">
              <p className="text-[13px] font-bold text-[#3d6b4f]">#Export</p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                ZIP или PNG
              </h3>
              <div className="mt-4">
              </div>
            </Layer>

            <Layer className="bg-[#ffe4ef] p-5 sm:p-6 md:col-span-7">
              <div className="flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[13px] font-bold text-[#9a4f6b]">#Готово</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                    От темы до публикации
                  </h3>
                  <p className="mt-2 max-w-sm text-[13px] text-[#5c6170]">
                    Без Canva, без пустого холста, без вечера на сборку.
                  </p>
                </div>
                <Link
                  href="/studio"
                  className="inline-flex h-11 shrink-0 items-center rounded-full bg-[#14151c] px-5 text-[13px] font-semibold text-white"
                >
                  Открыть студию
                </Link>
              </div>
            </Layer>
          </div>
        </Reveal>
      </section>

      <div className="pt-5">
        <AudienceBlock />
      </div>

      <section id="studio" className="mx-auto max-w-6xl scroll-mt-24 space-y-4 px-4 py-5 sm:px-6">
        <Reveal>
          <Layer className="bg-[#efe7ff]">
            <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="text-[13px] font-bold text-[#6b5f9a]">Студия</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Редактор
                  <br />
                  под ленту
                </h2>
                <p className="mt-4 max-w-sm text-base text-[#5c6170]">
                  Генерация открывает карусель на холсте. Дальше — слои, текст,
                  слайды и экспорт.
                </p>
                <ul className="mt-6 space-y-3">
                  {EDITOR_POINTS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-base font-semibold"
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-[#14151c] text-white">
                        <Check className="size-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/studio"
                  className="mt-8 inline-flex h-11 items-center rounded-full bg-[#14151c] px-5 text-[13px] font-semibold text-white"
                >
                  Открыть студию
                </Link>
              </div>
              <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[360px]">
                <div className="absolute inset-[10%] rounded-[2.5rem] bg-[#ddd0ff]" />
                <div className="absolute -right-2 top-8 size-14 rounded-full bg-white/60" />
                <div className="relative z-10 w-full max-w-md rotate-2">
                  <EditorMock />
                </div>
              </div>
            </div>
          </Layer>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid gap-3 lg:grid-cols-2">
            <Layer className="bg-[#e4ebff] p-7 sm:p-10">
              <p className="text-[13px] font-bold text-[#3a4f9a]">Иконки</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                14 млн
              </h2>
              <p className="mt-3 max-w-xs text-[13px] text-[#5c6170]">
                Поиск рядом с холстом. Знак встаёт на слайд.
              </p>
              <div className="mt-10">
              </div>
            </Layer>

            <Layer className="bg-[#fff4cc] p-7 sm:p-10">
              <p className="text-[13px] font-bold text-[#8a7a3a]">Шаблоны</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Каркас готов
              </h2>
              <p className="mt-3 max-w-xs text-[13px] text-[#5c6170]">
                Обложка и финал — меняете слова, ритм остаётся.
              </p>
              <div className="mt-8">
                <TemplatesPair />
              </div>
            </Layer>
          </div>
        </Reveal>
      </section>

      <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                FAQ
              </h2>
              <p className="mt-3 max-w-xs text-[13px] text-[#5c6170]">
                Коротко про генерацию, правки, экспорт и аккаунт.
              </p>
            </div>
            <Accordion type="single" collapsible defaultValue="what">
              {FAQ.map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="border-black/10"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5c6170]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <Layer className="bg-[#2f5bff] text-white">
            <div className="relative grid items-end gap-6 px-6 pt-12 sm:px-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="absolute -right-10 top-8 size-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-20 left-[40%] size-28 rounded-full bg-[#9eb6ff]/30 blur-xl" />
              <div className="relative z-10 pb-12 sm:pb-16">
                <h2 className="mt-3 max-w-md text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Тема есть.
                  <br />
                  Карусель — дальше.
                </h2>
                <p className="mt-4 max-w-sm text-[13px] text-white/75 sm:text-base">
                  Откройте студию и соберите первую ленту за один проход.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/studio"
                    className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#1a2f86]"
                  >
                    Создать карусель
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-[13px] font-semibold"
                  >
                    Войти
                  </button>
                </div>
              </div>
              <div className="relative z-10 overflow-hidden">
                <div className="absolute inset-x-8 top-10 bottom-0 rounded-[2rem] bg-[#1a3fd6]" />
                <DualPhonesMock />
              </div>
            </div>
          </Layer>
        </Reveal>
      </section>

      <footer>
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="text-[13px] font-semibold tracking-tight">
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#5c6170]">
            {NAV.map((item) => (
              <a
                key={item.link}
                href={item.link}
                className="hover:text-[#14151c]"
              >
                {item.name}
              </a>
            ))}
          </nav>
          <p className="text-[13px] text-[#8b90a0]">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
