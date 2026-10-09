import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-landing",
});

export const metadata: Metadata = {
  title: "Swibp — карусели из одной идеи",
  description: "Тема → карусель. Обложка, середина, финал. Правки в студии.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="light"
      className={`${manrope.className} min-h-full bg-[#f6f4fb] text-[#14151c]`}
    >
      {children}
    </div>
  );
}
