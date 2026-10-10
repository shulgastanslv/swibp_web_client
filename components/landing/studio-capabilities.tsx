import type { ReactNode } from "react";

function Card({
  className,
  eyebrow,
  ink,
  title,
  text,
  dark,
  children,
}: {
  className: string;
  eyebrow: string;
  ink: string;
  title: string;
  text: string;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className={`overflow-hidden rounded-[2rem] p-6 sm:rounded-[2.4rem] sm:p-7 ${className}`}>
      <p className="text-[13px] font-bold" style={{ color: ink }}>
        {eyebrow}
      </p>
      <h3 className={`mt-2 text-2xl font-extrabold tracking-tight ${dark ? "text-white" : "text-[#14151c]"}`}>
        {title}
      </h3>
      <p className={`mt-2 max-w-sm text-[13px] leading-relaxed ${dark ? "text-white/70" : "text-[#5c6170]"}`}>
        {text}
      </p>
      {children}
    </article>
  );
}

export function StudioCapabilities() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-12">
        <Card
          className="bg-[#e4ebff] md:col-span-7"
          eyebrow="Backgrounds"
          ink="#3a4f9a"
          title="Fill, pattern, or a split"
          text="A solid color, a texture, or two halves. Put it on every slide, only the marked ones, or just this frame."
        >
          <BackgroundArt />
        </Card>
        <Card
          className="bg-[#efe7ff] md:col-span-5"
          eyebrow="Grid"
          ink="#6b5f9a"
          title="Columns that snap"
          text="Columns, rows, and a margin. Objects sit on the lines instead of drifting."
        >
          <GridArt />
        </Card>
        <Card
          className="bg-[#fff4cc] md:col-span-5"
          eyebrow="Palette sets"
          ink="#8a7a3a"
          title="A set, not one swatch"
          text="Background, text, and accent move together. Apply the set to the carousel or to one slide."
        >
          <PaletteArt />
        </Card>
        <Card
          className="bg-[#14151c] md:col-span-7"
          eyebrow="Focus"
          ink="#ffe08a"
          title="The slide, nothing else"
          text="Focus mode clears the panels. You edit the frame. Esc brings the studio back."
          dark
        >
          <FocusArt />
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        <Tool
          eyebrow="Slides from text"
          title="One line, one slide"
          text="Paste the story. Each line becomes a frame."
        >
          <LinesArt />
        </Tool>
        <Tool
          eyebrow="Author"
          title="Name in the corner"
          text="Avatar and @handle, dropped onto the slide."
        >
          <AuthorArt />
        </Tool>
        <Tool eyebrow="Swipe" title="The cue to continue" text="swipe → sits where the thumb lands.">
          <SwipeArt />
        </Tool>
        <Tool eyebrow="Numbers" title="01 of 08" text="Pick the style and the corner. The count follows the deck.">
          <NumbersArt />
        </Tool>
      </div>
    </div>
  );
}

function Tool({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-white p-5 sm:rounded-[2.4rem]">
      <p className="text-[13px] font-bold text-[#2f5bff]">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-extrabold tracking-tight text-[#14151c]">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#5c6170]">{text}</p>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function BackgroundArt() {
  return (
    <svg viewBox="0 0 420 190" className="mt-2 h-auto w-full" aria-hidden>
      <circle cx="250" cy="110" r="78" fill="#fff" />
      <g transform="rotate(-10 110 110)">
        <rect x="28" y="42" width="110" height="132" rx="18" fill="#2f5bff" />
        <rect x="44" y="60" width="58" height="8" rx="4" fill="#fff" />
        <rect x="44" y="78" width="40" height="6" rx="3" fill="#c9d4ff" />
      </g>
      <g transform="rotate(6 230 108)">
        <rect x="164" y="36" width="118" height="140" rx="18" fill="#fff" />
        <circle cx="188" cy="64" r="4" fill="#c9d4ff" />
        <circle cx="206" cy="64" r="4" fill="#c9d4ff" />
        <circle cx="224" cy="64" r="4" fill="#c9d4ff" />
        <circle cx="188" cy="82" r="4" fill="#c9d4ff" />
        <circle cx="206" cy="82" r="4" fill="#c9d4ff" />
        <circle cx="224" cy="82" r="4" fill="#c9d4ff" />
        <circle cx="188" cy="100" r="4" fill="#c9d4ff" />
        <circle cx="206" cy="100" r="4" fill="#c9d4ff" />
        <rect x="180" y="124" width="72" height="28" rx="8" fill="#e4ebff" />
      </g>
      <g transform="rotate(12 340 120)">
        <clipPath id="bg-split">
          <rect x="292" y="48" width="100" height="124" rx="18" />
        </clipPath>
        <g clipPath="url(#bg-split)">
          <rect x="292" y="48" width="100" height="124" fill="#14151c" />
          <rect x="292" y="48" width="50" height="124" fill="#ffe08a" />
        </g>
        <rect x="308" y="68" width="22" height="8" rx="4" fill="#14151c" />
        <rect x="354" y="68" width="24" height="8" rx="4" fill="#fff" />
      </g>
    </svg>
  );
}

function GridArt() {
  return (
    <svg viewBox="0 0 280 180" className="mt-2 h-auto w-full" aria-hidden>
      <circle cx="150" cy="96" r="70" fill="#fff" />
      <rect x="36" y="22" width="208" height="140" rx="22" fill="#fff" />
      <path d="M78 40v104M120 40v104M162 40v104M204 40v104M52 62h176M52 96h176M52 130h176" stroke="#d9cef5" strokeWidth="2" />
      <rect x="120" y="62" width="84" height="68" rx="12" fill="#6b5f9a" />
      <circle cx="120" cy="62" r="4" fill="#2f5bff" />
      <circle cx="204" cy="62" r="4" fill="#2f5bff" />
      <circle cx="120" cy="130" r="4" fill="#2f5bff" />
      <circle cx="204" cy="130" r="4" fill="#2f5bff" />
    </svg>
  );
}

function PaletteArt() {
  return (
    <svg viewBox="0 0 280 170" className="mt-1 h-auto w-full" aria-hidden>
      <circle cx="150" cy="90" r="64" fill="#ffe08a" />
      <g transform="rotate(-8 90 96)">
        <rect x="24" y="58" width="132" height="64" rx="18" fill="#fff" />
        <circle cx="52" cy="90" r="12" fill="#14151c" />
        <circle cx="82" cy="90" r="12" fill="#fff4cc" />
        <circle cx="112" cy="90" r="12" fill="#2f5bff" />
        <circle cx="142" cy="90" r="12" fill="#e4ebff" />
      </g>
      <rect x="108" y="36" width="148" height="72" rx="20" fill="#fff" />
      <circle cx="140" cy="72" r="14" fill="#e5f6ea" />
      <circle cx="174" cy="72" r="14" fill="#3d6b4f" />
      <circle cx="208" cy="72" r="14" fill="#14151c" />
      <circle cx="242" cy="72" r="14" fill="#ffe08a" />
    </svg>
  );
}

function FocusArt() {
  return (
    <svg viewBox="0 0 420 180" className="mt-2 h-auto w-full" aria-hidden>
      <rect x="16" y="36" width="92" height="112" rx="18" fill="#2a2c38" />
      <rect x="312" y="36" width="92" height="112" rx="18" fill="#2a2c38" />
      <rect x="132" y="18" width="156" height="148" rx="22" fill="#fff" />
      <rect x="150" y="38" width="86" height="10" rx="5" fill="#14151c" />
      <rect x="150" y="56" width="54" height="7" rx="3.5" fill="#e4ebff" />
      <rect x="150" y="76" width="120" height="52" rx="12" fill="#2f5bff" />
      <rect x="164" y="92" width="48" height="7" rx="3.5" fill="#fff" />
      <rect x="228" y="138" width="44" height="18" rx="9" fill="#14151c" />
      <text x="250" y="151" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
        Esc
      </text>
    </svg>
  );
}

function LinesArt() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full" aria-hidden>
      <rect x="8" y="28" width="78" height="64" rx="16" fill="#fff" />
      <rect x="20" y="44" width="52" height="6" rx="3" fill="#14151c" />
      <rect x="20" y="56" width="40" height="6" rx="3" fill="#c9d4ff" />
      <rect x="20" y="68" width="46" height="6" rx="3" fill="#e4ebff" />
      <path d="M96 60h16" stroke="#2f5bff" strokeWidth="3" strokeLinecap="round" />
      <path d="M106 54l8 6-8 6" fill="none" stroke="#2f5bff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="122" y="18" width="28" height="40" rx="8" fill="#fff" />
      <rect x="154" y="34" width="28" height="52" rx="8" fill="#fff" />
      <rect x="186" y="26" width="28" height="46" rx="8" fill="#2f5bff" />
    </svg>
  );
}

function AuthorArt() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full" aria-hidden>
      <circle cx="150" cy="64" r="42" fill="#ffe08a" />
      <rect x="28" y="16" width="120" height="88" rx="18" fill="#fff" />
      <circle cx="52" cy="86" r="12" fill="#14151c" />
      <rect x="70" y="80" width="52" height="8" rx="4" fill="#14151c" />
      <rect x="70" y="92" width="28" height="5" rx="2.5" fill="#e4ebff" />
      <rect x="44" y="32" width="72" height="28" rx="8" fill="#e4ebff" />
    </svg>
  );
}

function SwipeArt() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full" aria-hidden>
      <rect x="24" y="14" width="128" height="92" rx="18" fill="#fff" />
      <rect x="40" y="30" width="72" height="10" rx="5" fill="#14151c" />
      <rect x="40" y="48" width="48" height="7" rx="3.5" fill="#e4ebff" />
      <rect x="72" y="74" width="68" height="22" rx="11" fill="#14151c" />
      <text x="106" y="89" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
        swipe →
      </text>
      <path d="M168 48c16 4 28 16 30 32" fill="none" stroke="#2f5bff" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function NumbersArt() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full" aria-hidden>
      <circle cx="64" cy="70" r="36" fill="#ffe08a" />
      <rect x="48" y="16" width="140" height="92" rx="18" fill="#14151c" />
      <rect x="66" y="34" width="78" height="10" rx="5" fill="#fff" />
      <rect x="66" y="52" width="52" height="7" rx="3.5" fill="#5c6170" />
      <rect x="66" y="70" width="104" height="22" rx="12" fill="#2f5bff" />
      <text x="70" y="86" fontSize="12" fontWeight="800" fill="#fff">
        01 / 08
      </text>
    </svg>
  );
}
