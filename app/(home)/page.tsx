"use client";

import { useState, useEffect } from "react";

import { ArrowUpRight, Plus, Sun, Moon, Sparkles } from "lucide-react";

import Image from "next/image";

export default function MinimalCarouselPage() {
  const [activeTab, setActiveTab] = useState("all");

  const [lang, setLang] = useState("EN");

  const [darkMode, setDarkMode] = useState(false);

  // Toggle theme class on root/document

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const categories = [
    { id: "all", label: "All" },

    { id: "instagram", label: "Instagram" },

    { id: "linkedin", label: "LinkedIn" },

    { id: "telegram", label: "Telegram" },

    { id: "threads", label: "Threads" },
  ];

  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between selection:bg-black selection:text-white transition-colors duration-300 ${
        darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"
      }`}
    >
      <header className="w-full max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2">
          <Image height={25} width={25} src="/Logo.svg" alt="Logo" />
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}

          {/* New Project Button */}

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity ${
              darkMode
                ? "bg-white text-black hover:opacity-90"
                : "bg-black text-white hover:opacity-80"
            }`}
          >
            <Plus className="w-4 h-4" />

            <span>New Project</span>
          </button>

          {/* Language Switcher */}

          <div
            className={`flex items-center text-xs font-semibold border rounded-full p-0.5 ${
              darkMode ? "border-neutral-800" : "border-neutral-200"
            }`}
          >
            <button
              onClick={() => setLang("RU")}

              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === "RU"
                  ? darkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : "text-neutral-400 hover:opacity-15"
              }`}
            >
              RU
            </button>

            <button
              onClick={() => setLang("EN")}

              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === "EN"
                  ? darkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : "text-neutral-400 hover:opacity-15"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}

            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-black"
            }`}

            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}

      <main className="w-full max-w-7xl mx-auto px-8 py-6 flex flex-col gap-12 flex-1">
        {/* Title and Categories */}

        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 ${
            darkMode ? "border-neutral-900" : "border-neutral-100"
          }`}
        >
          <h1 className="text-5xl font-light tracking-tight">
            Hello, shulgastanslv
          </h1>

          {/* Categories */}

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}

                onClick={() => setActiveTab(cat.id)}

                className={`text-sm px-4 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  activeTab === cat.id
                    ? darkMode
                      ? "bg-neutral-900 font-medium text-white"
                      : "bg-neutral-100 font-medium text-black"
                    : "text-neutral-400 hover:opacity-80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}

          <div className="group cursor-pointer flex flex-col gap-4">
            <div
              className={`w-full h-[450px] rounded-2xl flex items-center justify-center p-8 transition-all duration-300 ${
                darkMode
                  ? "bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900"
                  : "bg-neutral-50 border-neutral-100 hover:bg-neutral-100/60"
              }`}
            >
              <div
                className={`w-full h-full p-40 rounded-xl shadow-sm border flex items-center justify-center text-xs font-mono ${
                  darkMode
                    ? "bg-neutral-900 border-neutral-800 text-neutral-600"
                    : "bg-white border-neutral-200/60 text-neutral-300"
                }`}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-normal tracking-tight">
                Templates & Seamless
              </span>

              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:opacity-100 transition-colors" />
            </div>
          </div>

          <div className="group cursor-pointer flex flex-col gap-4">
            <div
              className={`w-full h-[450px] rounded-2xl flex items-center justify-center p-8 transition-all duration-300 ${
                darkMode
                  ? "bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900"
                  : "bg-neutral-50 border-neutral-100 hover:bg-neutral-100/60"
              }`}
            >
              <div
                className={`w-full h-full p-40 rounded-xl shadow-sm border flex items-center justify-center text-xs font-mono ${
                  darkMode
                    ? "bg-neutral-900 border-neutral-800 text-neutral-600"
                    : "bg-white border-neutral-200/60 text-neutral-300"
                }`}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-normal tracking-tight">
                Projecs Library
              </span>

              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:opacity-100 transition-colors" />
            </div>
          </div>
        </div>
      </main>

      <footer
        className={`w-full max-w-7xl mx-auto px-8 h-20 border-t flex items-center justify-between text-xs text-neutral-400 ${
          darkMode ? "border-neutral-900" : "border-neutral-100"
        }`}
      >
        <div>© {new Date().getFullYear()} Swibp.</div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:opacity-80 transition-opacity">
            About
          </a>

          <a href="#" className="hover:opacity-80 transition-opacity">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
