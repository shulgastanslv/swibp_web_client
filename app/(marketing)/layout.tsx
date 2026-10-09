import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-landing",
});

export const metadata: Metadata = {
  title: "Swibp — ИИ собирает карусели",
  description:
    "Опишите тему, и ИИ создаст карусель: обложка, середина и финал в одном стиле.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="light"
      className={`${manrope.className} min-h-dvh w-full touch-pan-y overflow-x-clip bg-[#f4f1ea] text-[#161616]`}
    >
      {children}
    </div>
  );
}
