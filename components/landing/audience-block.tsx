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
    name: "Developers",
    app: "instagram",
    handle: "release",
    avatar: "/landing/slide-mid.jpg",
    post: "A carousel about shipping: what to check and how to finish.",
    text: "One step, one frame.",
    panel: "#e4ebff",
    slides: [
      {
        src: "/landing/slide-mid.jpg",
        title: "Ship without panic",
        caption: "The cover names what the carousel is about.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "Three checks",
        caption: "The middle lays out the steps.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "Ready to ship",
        caption: "The ending leaves an action.",
      },
    ],
  },
  {
    id: "smm",
    name: "SMM",
    app: "threads",
    handle: "feed",
    avatar: "/landing/slide-cover.jpg",
    post: "A series in six frames. Cover, explanation, ending.",
    text: "A series in minutes, not an evening.",
    panel: "#ffe4ef",
    slides: [
      {
        src: "/landing/slide-cover.jpg",
        title: "A hook for the feed",
        caption: "The first frame stops the scroll.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "The series, in order",
        caption: "Slides read one after another.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "What to do next",
        caption: "The last frame does not repeat the cover.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketers",
    app: "instagram",
    handle: "launch",
    avatar: "/landing/slide-end.jpg",
    post: "A launch in one carousel: who, why, and what is next.",
    text: "A launch in one feed.",
    panel: "#fff4cc",
    slides: [
      {
        src: "/landing/slide-end.jpg",
        title: "A quiet launch",
        caption: "The cover says why to open it.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Who this is for",
        caption: "The middle explains without jargon.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "The next step",
        caption: "The ending leaves an action.",
      },
    ],
  },
  {
    id: "editors",
    name: "Editors",
    app: "threads",
    handle: "desk",
    avatar: "/landing/slide-cover.jpg",
    post: "One point per slide. The carousel keeps the column's rhythm.",
    text: "One point per frame.",
    panel: "#efe7ff",
    slides: [
      {
        src: "/landing/slide-cover.jpg",
        title: "One point",
        caption: "The cover keeps the promise of the text.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "A tight middle",
        caption: "Each slide adds a step.",
      },
      {
        src: "/landing/slide-end.jpg",
        title: "A short ending",
        caption: "The last frame closes the thought.",
      },
    ],
  },
  {
    id: "founders",
    name: "Founders",
    app: "instagram",
    handle: "product",
    avatar: "/landing/slide-end.jpg",
    post: "Why the product, how it works, and where to go next.",
    text: "A product, without a pitch deck.",
    panel: "#e5f6ea",
    slides: [
      {
        src: "/landing/slide-end.jpg",
        title: "Why the product",
        caption: "The cover states the promise.",
      },
      {
        src: "/landing/slide-cover.jpg",
        title: "How it works",
        caption: "The middle shows the path.",
      },
      {
        src: "/landing/slide-mid.jpg",
        title: "Where next",
        caption: "The ending leaves the next step.",
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
        <p className="text-[13px] font-bold tracking-wide text-[#2f5bff]">Who it is for</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          One studio, different feeds
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
                        ? "h-10 rounded-full bg-[#14151c] px-4 text-[13px] font-semibold text-white"
                        : "h-10 rounded-full bg-white/70 px-4 text-[13px] font-semibold text-[#14151c]"
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
