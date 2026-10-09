"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SLIDES = [
  {
    src: "/landing/slide-cover.jpg",
    title: "Карусель из одной мысли",
    caption: "Обложка уже держит ритм.",
  },
  {
    src: "/landing/slide-mid.jpg",
    title: "Середина объясняет",
    caption: "Кадры идут по порядку.",
  },
  {
    src: "/landing/slide-end.jpg",
    title: "Финал оставляет действие",
    caption: "Последний слайд зовёт дальше.",
  },
];

export type FeedSlide = {
  src: string;
  title: string;
  caption: string;
};

function useSlide(start = 0, count = SLIDES.length, enabled = true) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(start);

  useEffect(() => {
    if (reduce || !enabled) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce, count, enabled]);

  return index;
}

function Dots({ index, count, on = "light" }: { index: number; count: number; on?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, dot) => (
        <span
          key={dot}
          className={
            dot === index
              ? on === "light"
                ? "h-1.5 w-1.5 rounded-full bg-white"
                : "h-1.5 w-1.5 rounded-full bg-[#2f5bff]"
              : on === "light"
                ? "h-1.5 w-1.5 rounded-full bg-white/45"
                : "h-1.5 w-1.5 rounded-full bg-black/20"
          }
        />
      ))}
    </span>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
    </svg>
  );
}

function Comment() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 17.5 4 20v-5.2A7 7 0 1 1 8.2 18H6z" />
    </svg>
  );
}

function Send() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12 20 5l-6 15-2.2-6.2L4 12z" />
    </svg>
  );
}

function Bookmark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4.5h10v15l-5-3-5 3v-15z" />
    </svg>
  );
}

function Repost() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 7h9l-2.2-2.2M17 17H8l2.2 2.2" />
      <path d="M16 7v4M8 17v-4" />
    </svg>
  );
}

function Frame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.img
        key={`${src}-${title}`}
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0.35, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
      <p className="absolute right-3 bottom-7 left-3 text-[15px] leading-[1.05] font-extrabold tracking-tight text-white">
        {title}
      </p>
    </div>
  );
}

export function InstagramFeed({
  slides = SLIDES,
  index,
  handle = "swibp",
  avatar = "/landing/slide-cover.jpg",
}: {
  slides?: FeedSlide[];
  index?: number;
  handle?: string;
  avatar?: string;
} = {}) {
  const local = useSlide(0, slides.length, index === undefined);
  const current = index ?? local;
  const slide = slides[current] ?? slides[0];

  return (
    <div className="flex aspect-[9/16] flex-col bg-white text-[#14151c]">
      <div className="flex items-center gap-2 px-3 pt-7 pb-2">
        <img src={avatar} alt="" className="size-7 rounded-full object-cover" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11px] font-semibold">{handle}</p>
          <p className="text-[10px] text-[#8b90a0]">Карусель</p>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <Frame src={slide.src} title={slide.title} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Dots index={current} count={slides.length} />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-3">
          <Heart />
          <Comment />
          <Send />
        </span>
        <Bookmark />
      </div>
      <p className="line-clamp-2 px-3 pb-3 text-[11px] leading-snug">
        <span className="font-semibold">{handle}</span> {slide.caption}
      </p>
    </div>
  );
}

export function ThreadsFeed({
  slides = SLIDES,
  index,
  handle = "swibp",
  post = "Карусель из одной мысли. Обложка, середина и финал.",
  avatar = "/landing/slide-mid.jpg",
}: {
  slides?: FeedSlide[];
  index?: number;
  handle?: string;
  post?: string;
  avatar?: string;
} = {}) {
  const local = useSlide(1, slides.length, index === undefined);
  const current = index ?? local;
  const slide = slides[current] ?? slides[0];

  return (
    <div className="flex aspect-[9/16] flex-col bg-white px-3 pt-7 text-[#14151c]">
      <div className="flex gap-2">
        <img src={avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold">{handle}</p>
          <p className="text-[11px] leading-snug text-[#3c3c3c]">{post}</p>
        </div>
      </div>
      <div className="relative mt-2 min-h-0 flex-1 overflow-hidden rounded-2xl">
        <Frame src={slide.src} title={slide.title} />
      </div>
      <div className="flex items-center justify-between py-2.5">
        <span className="flex items-center gap-3">
          <Heart />
          <Comment />
          <Repost />
          <Send />
        </span>
        <Dots index={current} count={slides.length} on="dark" />
      </div>
    </div>
  );
}
