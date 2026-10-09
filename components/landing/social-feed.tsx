"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Repeat2,
  MoreHorizontal
} from "lucide-react"; // <-- Красивые иконки из коробки

export type FeedSlide = {
  src: string;
  title: string;
  caption: string;
};

const SLIDES = [
  {
    src: "https://i.pinimg.com/736x/33/d4/78/33d47874c4e5f6fd592c148f92a0a9a4.jpg",
    title: "Если вечером есть 5 минут",
    caption: "Когда меньше значит больше.",
  },
  {
    src: "https://i.pinimg.com/736x/40/dd/07/40dd0784cbdc504cea21f61425ff2daf.jpg",
    title: "Городской ритм",
    caption: "Движение в каждом кадре.",
  },
  {
    src: "https://i.pinimg.com/736x/2b/24/ed/2b24edb122a755cb5fa936e3e626d4e8.jpg",
    title: "Природа зовет",
    caption: "Выдохни и посмотри вокруг.",
  },
];

function useSlide(start = 0, count = SLIDES.length, enabled = true) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(start);

  useEffect(() => {
    if (reduce || !enabled) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 3500);
    return () => window.clearInterval(id);
  }, [reduce, count, enabled]);

  return index;
}

function Dots({ index, count }: { index: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, dot) => (
        <div
          key={dot}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            dot === index ? "bg-white" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}

function Frame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative h-full w-full bg-neutral-900">
      <motion.img
        key={src}
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      <div className="absolute bottom-6 left-4 right-4">
        <p className="text-lg font-bold text-white leading-tight drop-shadow-md">
          {title}
        </p>
      </div>
    </div>
  );
}

// --- Instagram Feed Component ---
export function InstagramFeed({
  slides = SLIDES,
  index: controlledIndex,
}: {
  slides?: typeof SLIDES;
  index?: number;
}) {
  const localIndex = useSlide(0, slides.length, controlledIndex === undefined);
  const currentIndex = controlledIndex ?? localIndex;
  const slide = slides[currentIndex];

  return (
    <div className="flex h-full flex-col bg-white text-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
             <img src={slide.src} className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-semibold">design_daily</span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-500" />
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden">
        <Frame src={slide.src} title={slide.title} />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Dots index={currentIndex} count={slides.length} />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="h-6 w-6 hover:text-blue-500 cursor-pointer transition-colors" />
            <Send className="h-6 w-6 hover:text-green-500 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="h-6 w-6 hover:text-yellow-500 cursor-pointer transition-colors" />
        </div>
        <p className="text-sm text-neutral-500">Нравится 1,240 людям</p>
        <p className="text-sm mt-1">
          <span className="font-semibold mr-1">design_daily</span>
          {slide.caption}
        </p>
      </div>
    </div>
  );
}

// --- Threads Feed Component ---
export function ThreadsFeed({
  slides = SLIDES,
  index: controlledIndex,
}: {
  slides?: typeof SLIDES;
  index?: number;
}) {
  const localIndex = useSlide(1, slides.length, controlledIndex === undefined);
  const currentIndex = controlledIndex ?? localIndex;
  const slide = slides[currentIndex];

  return (
    <div className="flex h-full flex-col bg-white text-neutral-900 p-4">
      {/* Header Thread */}
      <div className="flex gap-3 mb-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200 overflow-hidden">
           <img src={slide.src} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
             <span className="font-semibold text-sm">swibp</span>
             <span className="text-sm text-neutral-400">2ч</span>
          </div>
          <p className="text-sm leading-snug mt-1">
            Карусель из одной мысли. Обложка, середина и финал. 🧵
          </p>
        </div>
      </div>

      {/* Media Content */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-100 mb-4">
        <Frame src={slide.src} title="" /> {/* Убираем текст внутри картинки для чистоты треде */}
         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <Dots index={currentIndex} count={slides.length} />
         </div>
      </div>

      {/* Actions Thread Style */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
        <div className="flex gap-4">
          <Heart className="h-5 w-5 text-neutral-600" />
          <Repeat2 className="h-5 w-5 text-neutral-600" />
          <MessageCircle className="h-5 w-5 text-neutral-600" />
          <Send className="h-5 w-5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
