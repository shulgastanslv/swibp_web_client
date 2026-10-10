"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bookmark, Heart, MessageCircle, Repeat2, Send, ThumbsUp } from "lucide-react";
import { PhoneFrame } from "@/components/landing/hero-stage";

const NETWORKS = [
  {
    id: "instagram",
    name: "Instagram",
    ratio: "4:5",
    use: "Feed carousel",
    note: "A tall cover stops the scroll. The next frames keep the same width.",
    panel: "#14151c",
    ink: "#fff",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    ratio: "1:1",
    use: "Document post",
    note: "A square sequence for a launch, a hire, or a point of view.",
    panel: "#14151c",
    ink: "#3a4f9a",
  },
  {
    id: "telegram",
    name: "Telegram",
    ratio: "1:1",
    use: "Channel album",
    note: "Frames go out as an album. The caption sits under the first one.",
    panel: "#14151c",
    ink: "#3d6b4f",
  },
  {
    id: "threads",
    name: "Threads",
    ratio: "4:5",
    use: "Short thread",
    note: "The same story, a shorter caption, still a swipe.",
    panel: "#14151c",
    ink: "#6b5f9a",
  },
  {
    id: "x",
    name: "X",
    ratio: "16:9",
    use: "Timeline frame",
    note: "A wide cover for the timeline, then the rest of the idea.",
    panel: "#14151c",
    ink: "#8a7a3a",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    ratio: "9:16",  
    use: "Tall pin",
    note: "One story, stretched into a pin people save.",
    panel: "#14151c",
    ink: "#9a5a3a",
  },
] as const;

export function NetworksBlock() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const network = NETWORKS[index];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % NETWORKS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section id="networks" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-5 sm:px-6">
      <div className="mb-6 max-w-2xl">
        <p className="text-[13px] font-bold tracking-wide text-white">Networks</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          One carousel, every feed
        </h2>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-white">
          Switch the ratio and the same story fits the place you post.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[2rem] p-6 transition-colors duration-500 sm:rounded-[2.4rem] sm:p-8"
        style={{ background: network.panel }}
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {NETWORKS.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setIndex(itemIndex)}
                className={
                  active
                    ? "h-10 shrink-0 rounded-full bg-white px-4 text-[13px] font-semibold text-black"
                    : "h-10 shrink-0 rounded-full bg-white/75 px-4 text-[13px] font-semibold text-black"
                }
              >
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={network.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[13px] font-bold text-white">
                {network.use}
              </p>
              <h3 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                {network.name}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white">
                {network.note}
              </p>
              <p className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-4 text-[13px] font-extrabold text-black">
                {network.ratio}
              </p>
            </motion.div>
          </AnimatePresence>
          <FrameStack ratio={network.ratio} />
        </div>
      </div>
    </section>
  );
}

function FrameStack({ ratio }: { ratio: string }) {
  const aspect =
    ratio === "9:16" ? "aspect-[9/16] w-[92px]" : ratio === "16:9" ? "aspect-video w-[210px]" : ratio === "1:1" ? "aspect-square w-[150px]" : "aspect-[4/5] w-[140px]";

  return (
    <div className="relative mx-auto flex h-[240px] w-full max-w-[320px] items-center justify-center" aria-hidden>
      <div className={`absolute -rotate-6 translate-x-10 rounded-2xl bg-white ${aspect}`} />
      <div className={`absolute rotate-3 -translate-x-8 rounded-2xl bg-white ${aspect}`} />
      <div className={`relative rounded-2xl bg-white p-3 shadow-[0_16px_40px_rgba(20,21,28,0.08)] ${aspect}`}>
        <div className="h-2 w-2/3 rounded-full bg-[#14151c]" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-[#e4ebff]" />
        <div className="mt-3 h-[45%] rounded-2xl bg-[#2f5bff]" />
        <div className="mt-3 flex gap-1">
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
