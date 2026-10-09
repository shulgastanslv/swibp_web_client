"use client";

import { motion } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { CoverHook, CoverList } from "@/components/landing/covers";

export function HeroStage() {
  return (
    <CardContainer containerClassName="py-0" className="w-full">
      <CardBody className="relative mx-auto h-[460px] w-full max-w-[520px] sm:h-[520px]">
        <CardItem translateZ={16} className="absolute top-10 left-0 w-[46%] sm:top-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CoverList />
          </motion.div>
        </CardItem>

        <CardItem translateZ={48} className="absolute top-0 right-0 w-[72%]">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[1.85rem] bg-white p-2 shadow-[0_30px_80px_rgba(15,23,70,0.28)]"
          >
            <CoverHook />
          </motion.div>
        </CardItem>

        <CardItem translateZ={80} className="absolute bottom-6 left-2 sm:left-4">
          <div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#14151c] shadow-xl">
            Промпт → 6 слайдов
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
