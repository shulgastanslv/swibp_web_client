"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CoverHook, CoverList } from "@/components/landing/covers";

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
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[540px] sm:h-[520px]">
      <motion.div
        className="absolute top-14 left-0 w-[48%] -rotate-[10deg]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PhoneFrame>
          <CoverList />
        </PhoneFrame>
      </motion.div>

      <motion.div
        className="absolute top-0 right-0 w-[64%] rotate-[7deg]"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <PhoneFrame>
          <CoverHook />
        </PhoneFrame>
      </motion.div>

      <motion.div
        className="absolute top-6 left-[34%] z-20 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-[#14151c] shadow-xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      >
        6 слайдов
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-2 z-20 max-w-[12rem] rounded-2xl bg-white px-3 py-2 text-[#14151c] shadow-xl"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-sm font-semibold">Обложка готова</p>
        <p className="text-xs text-[#6b7080]">Первый кадр уже собран</p>
      </motion.div>
    </div>
  );
}
