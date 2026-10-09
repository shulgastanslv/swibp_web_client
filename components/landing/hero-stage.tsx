"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { InstagramFeed, ThreadsFeed } from "@/components/landing/social-feed";

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[2.1rem] bg-[#101218] p-[7px] shadow-[0_28px_70px_rgba(8,16,60,0.35)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.65rem] bg-black">
        <div className="pointer-events-none absolute top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const rotBack = useTransform(scrollYProgress, [0, 1], [-10, -16]);
  const rotFront = useTransform(scrollYProgress, [0, 1], [7, 1]);

  return (
    <div ref={ref} className="relative mx-auto h-[540px] w-full max-w-[540px] sm:h-[620px]">
      <motion.div
        className="absolute top-10 left-0 w-[46%]"
        style={reduce ? undefined : { y: yBack, rotate: rotBack }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneFrame>
            <ThreadsFeed />
          </PhoneFrame>
          <p className="mt-2 text-center text-[11px] font-semibold tracking-wide text-white/80">Threads</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-0 right-0 w-[56%]"
        style={reduce ? { rotate: 7 } : { y: yFront, rotate: rotFront }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 12, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneFrame>
            <InstagramFeed />
          </PhoneFrame>
          <p className="mt-2 text-center text-[11px] font-semibold tracking-wide text-white/80">Instagram</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
