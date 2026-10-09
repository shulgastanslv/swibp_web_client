"use client";

import { motion } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

function CreamSlide() {
  return (
    <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#f6f1e8] p-5 text-[#161513] shadow-2xl">
      <p className="font-mono text-[10px] tracking-[0.22em] text-[#8c877d]">
        DESIGN NOTES — 04
      </p>
      <div className="mt-8 space-y-1">
        <p className="font-serif text-3xl leading-none">Где я</p>
        <p className="font-serif text-3xl leading-none">беру</p>
        <p className="mt-2 inline-block rounded-lg bg-[#2f5bff] px-2 py-1 font-serif text-2xl text-white">
          референсы
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2">
        <div className="h-16 rounded-xl bg-[#e7dfd2]" />
        <div className="h-16 rounded-xl bg-[#d9cfc0]" />
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-wider text-[#5c584f]">
        01 / 08
      </p>
    </div>
  );
}

function InkSlide() {
  return (
    <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#14151c] p-4 text-white shadow-2xl">
      <p className="font-mono text-[10px] tracking-[0.18em] text-[#a78bfa]">
        СЛАЙД 03
      </p>
      <p className="mt-6 text-2xl font-extrabold leading-none">
        Три правила
        <br />
        обложки
      </p>
      <ul className="mt-5 space-y-2 text-[11px]">
        <li className="rounded-xl bg-white/10 px-3 py-2">01 Один акцент</li>
        <li className="rounded-xl bg-white/10 px-3 py-2">02 Крупный заголовок</li>
        <li className="rounded-xl bg-[#2f5bff] px-3 py-2">03 Воздух вокруг</li>
      </ul>
    </div>
  );
}

export function HeroStage() {
  return (
    <CardContainer
      containerClassName="py-0"
      className="w-full"
    >
      <CardBody className="relative h-[440px] w-full sm:h-[500px]">
        <CardItem
          translateZ={20}
          className="absolute top-6 left-0 w-[46%] sm:top-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <InkSlide />
          </motion.div>
        </CardItem>

        <CardItem
          translateZ={60}
          className="absolute top-0 right-0 w-[58%]"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[1.8rem] bg-white p-2 shadow-[0_30px_80px_rgba(15,23,70,0.28)]"
          >
            <CreamSlide />
          </motion.div>
        </CardItem>

        <CardItem
          translateZ={90}
          translateX={-8}
          className="absolute bottom-10 left-2 sm:left-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-[#14151c] shadow-xl"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#2f5bff] text-xs font-bold text-white">
              12
            </span>
            <span className="pr-1 text-left">
              <span className="block text-xs font-semibold">Слои на месте</span>
              <span className="block text-[10px] text-[#6b7080]">
                Заголовок · фото · плашка
              </span>
            </span>
          </motion.div>
        </CardItem>

        <CardItem translateZ={80} className="absolute right-2 bottom-4 sm:right-6">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full bg-[#ff8a3d] px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg"
          >
            Экспорт PNG
          </motion.div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
