"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

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
import { PhoneFrame } from "@/components/landing/hero-stage";
import { Reveal } from "@/components/landing/reveal";
import { CoverClose, CoverHook, CoverList } from "@/components/landing/covers";

const NAV = [
  { name: "Возможности", link: "#features" },
  { name: "Редактор", link: "#editor" },
  { name: "Иконки", link: "#icons" },
  { name: "Как это работает", link: "#how" },
  { name: "Отзывы", link: "#stories" },
];

const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "Telegram",
  "Threads",
  "Pinterest",
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
    name: "Алина",
    role: "Редактор",
  },
  {
    quote:
      "Раньше карусель разъезжалась между файлами. Теперь она создаётся сразу: обложка, список, финал — один стиль.",
    name: "Илья",
    role: "Основатель",
  },
  {
    quote:
      "ИИ закрывает черновик карусели. Формулировку ставлю сам и не собираю кадры с нуля.",
    name: "Марина",
    role: "Дизайнер",
  },
];

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div>
      <AuthModal isOpen={authOpen} onOpenChange={setAuthOpen} />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f4f1ea]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="grid size-9 place-items-center overflow-hidden rounded-xl bg-white shadow-sm"
            aria-label="Swibp"
          >
            <Logo width={36} height={36} />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#3a3834] md:flex">
            {NAV.map((item) => (
              <a key={item.link} href={item.link} className="hover:text-black">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden h-10 rounded-full px-4 sm:inline-flex"
              onClick={() => setAuthOpen(true)}
            >
              Войти
            </Button>
            <Button asChild className="h-10 rounded-full bg-[#161616] px-4 text-white hover:bg-black">
              <Link href="/studio">Открыть студию</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Меню">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,20rem)] bg-[#f4f1ea]">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  {NAV.map((item) => (
                    <SheetClose asChild key={item.link}>
                      <a href={item.link} className="rounded-xl px-3 py-3 text-base font-medium">
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
                  <Button asChild className="h-10 rounded-full bg-[#161616] text-white">
                    <Link href="/studio">Открыть студию</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-14 pb-6 text-center sm:px-6 sm:pt-20">
        <h1 className="mx-auto max-w-4xl text-[2.7rem] leading-[0.92] font-extrabold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          Карусель
          <br />
          из одной мысли.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#5c5852] sm:text-lg">
          Опишите тему. ИИ создаст карусель: обложка, середина и финал в одном стиле.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="h-12 rounded-full bg-[#161616] px-6 text-white hover:bg-black">
            <Link href="/studio">Создать карусель</Link>
          </Button>
          <a
            href="#how"
            className="inline-flex h-12 items-center rounded-full border border-black/15 bg-white px-6 text-sm font-medium"
          >
            Как это устроено
          </a>
        </div>

        <div className="mx-auto mt-10 w-[min(100%,280px)] sm:hidden">
          <PhoneFrame>
            <CoverHook />
          </PhoneFrame>
        </div>
        <div className="relative mx-auto mt-12 hidden h-[500px] max-w-3xl overflow-hidden sm:block">
          <div className="absolute inset-x-16 top-8 bottom-0 rounded-[2.2rem] bg-[#efe7ff]" />
          <div className="absolute top-16 left-[10%] w-[36%] -rotate-6">
            <PhoneFrame>
              <CoverList />
            </PhoneFrame>
          </div>
          <div className="absolute top-4 right-[12%] w-[42%] rotate-3">
            <PhoneFrame>
              <CoverHook />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="max-w-full overflow-x-clip py-8">
        <div className="relative overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="pointer-events-none flex w-max animate-marquee gap-12 pr-12">
            {[...PLATFORMS, ...PLATFORMS].map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="text-2xl font-extrabold tracking-tight text-[#161616]/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
        <Reveal>
          <h2 className="max-w-xl text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
            Карусель собирается из описания
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-12">
            <article className="flex flex-col justify-between rounded-[2rem] bg-[#ffd9e6] p-7 sm:p-9 lg:col-span-7">
              <h3 className="max-w-sm text-3xl leading-[0.95] font-extrabold tracking-tight sm:text-4xl">
                Из одного текста
              </h3>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-[#3d2a32]">
                Промпт становится планом кадров. Обложка получает крючок, середина — аргументы, финал — действие.
              </p>
            </article>
            <article className="rounded-[2rem] bg-[#e8ff47] p-7 sm:p-9 lg:col-span-5">
              <h3 className="text-3xl leading-[0.95] font-extrabold tracking-tight">Один голос</h3>
              <p className="mt-6 text-base leading-relaxed text-[#2c3310]">
                Тон, обращение и сила обещания не прыгают от слайда к слайду.
              </p>
            </article>
            <article className="overflow-hidden rounded-[2rem] bg-[#161616] text-white lg:col-span-5">
              <div className="p-7 sm:p-9">
                <h3 className="text-3xl leading-[0.95] font-extrabold tracking-tight">
                  Крючок, объяснение, действие
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                  Первый кадр останавливает ленту, середина раскрывает мысль, финал оставляет следующий шаг.
                </p>
              </div>
              <div className="px-8 pb-0">
                <div className="mx-auto w-[210px] translate-y-6">
                  <PhoneFrame>
                    <CoverClose />
                  </PhoneFrame>
                </div>
              </div>
            </article>
            <article className="relative min-h-[320px] overflow-hidden rounded-[2rem] lg:col-span-7">
              <img
                src="/landing/slide-cover.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-end p-7 text-white sm:p-9">
                <h3 className="max-w-sm text-3xl leading-[0.95] font-extrabold tracking-tight sm:text-4xl">
                  Один стиль на все слайды
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                  Обложка, середина и финал звучат одинаково.
                </p>
              </div>
            </article>
          </div>
        </Reveal>
      </section>

      <section id="editor" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 sm:px-6">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
                Удобный редактор
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#5c5852]">
                Черновик открывается на холсте. Текст, фото и плашки правятся в том же кадре, карусель не разъезжается по файлам.
              </p>
              <Link href="/studio" className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4">
                Открыть студию
              </Link>
            </div>
            <div className="rounded-[2rem] bg-[#d7f5c8] p-6 sm:p-8">
              <div className="mx-auto w-[230px] sm:w-[260px]">
                <PhoneFrame>
                  <CoverList />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Reveal>
          <div className="grid items-center gap-4 lg:grid-cols-2">
            <article className="rounded-[2rem] bg-white p-7 sm:p-10">
              <h2 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
                Шаблоны
              </h2>
              <ul className="mt-8 space-y-3 text-2xl font-semibold tracking-tight">
                <li>Журнальная обложка</li>
                <li>Сетка с материалами</li>
                <li>Мудборд</li>
              </ul>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-[#5c5852]">
                Каркас уже стоит. Меняете слова, ритм слайда остаётся.
              </p>
            </article>
            <article className="flex min-h-[360px] flex-col justify-between rounded-[2rem] bg-[#cfe6ff] p-7 sm:p-10">
              <p className="max-w-sm text-3xl leading-snug font-extrabold tracking-tight sm:text-4xl">
                «Объясни карусель за шесть кадров. Спокойно, для редакторов.»
              </p>
              <Link href="/studio" className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">
                Создать карусель
              </Link>
            </article>
          </div>
        </Reveal>
      </section>

      <section id="icons" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 sm:px-6">
        <Reveal>
          <div className="rounded-[2rem] bg-[#161616] px-7 py-12 text-white sm:px-12 sm:py-16">
            <h2 className="text-6xl leading-none font-extrabold tracking-tighter sm:text-8xl">
              14<span className="text-[#e8ff47]"> млн</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              иконок в студии. Поиск рядом с холстом, знак встаёт на кадр и остаётся в том же ритме, что и карусель.
            </p>
            <Link
              href="/studio"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#161616]"
            >
              Открыть библиотеку
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
        <Reveal>
          <h2 className="max-w-xl text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
            Как это работает
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Опишите тему", "Пара предложений: о чём карусель, для кого и какой тон."],
              ["ИИ раскладывает мысль", "Обложка получает крючок, середина — аргументы, финал — действие."],
              ["Поправьте и заберите", "Уточните формулировки. Кадры уже собраны, заново их собирать не нужно."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.7rem] bg-white p-6 sm:p-7">
                <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5852] sm:text-base">{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <CoverHook />
            <CoverList />
            <CoverClose />
          </div>
        </Reveal>
      </section>

      <section id="stories" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
            Как это звучит в работе
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {STORIES.map((item) => (
              <article key={item.name} className="rounded-[1.7rem] bg-white p-6 sm:p-7">
                <p className="text-lg leading-snug font-semibold tracking-tight">{item.quote}</p>
                <p className="mt-6 text-sm font-bold">{item.name}</p>
                <p className="text-sm text-[#5c5852]">{item.role}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-24 items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
          Как ИИ создаёт карусель
        </h2>
        <Accordion type="single" collapsible defaultValue="prompt">
          {CARE.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-black/10">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-[#5c5852]">{item.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6">
        <div className="rounded-[2rem] bg-[#161616] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-xl text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-5xl">
            Опишите тему. Заберите карусель.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            ИИ создаст карусель. Вы поправите текст и скачаете кадры.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="inline-flex h-11 items-center rounded-full bg-[#e8ff47] px-5 text-sm font-semibold text-[#161616]"
            >
              Создать карусель
            </Link>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-semibold"
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
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5c5852]">
            <a href="#features" className="hover:text-[#161616]">
              Возможности
            </a>
            <a href="#editor" className="hover:text-[#161616]">
              Редактор
            </a>
            <a href="#icons" className="hover:text-[#161616]">
              Иконки
            </a>
            <a href="#how" className="hover:text-[#161616]">
              Как это работает
            </a>
          </nav>
          <p className="text-xs text-[#8a857c]">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
