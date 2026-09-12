"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-full flex-col justify-between p-6 bg-black text-white overflow-hidden">
      {/* Фоновый желтый светящийся градиент снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-pink-400/50 via-pink-500/10 to-transparent pointer-events-none blur-3xl" />

      {/* Верхняя часть: Кнопка закрытия */}
      <div className="flex items-center justify-end relative z-10">
        <button className="h-9 w-9 rounded-full bg-zinc-900/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
          ✕
        </button>
      </div>

      {/* Центр: Логотип, заголовок и описание */}
      <div className="flex flex-col items-center text-center relative z-10 my-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shadow-xl mb-6">
          <Image height={32} width={32} src={"/Logo.svg"} alt={"Logo"} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Get started
        </h1>
        <p className="text-xs text-zinc-400 max-w-xs">
          Create your account to access all Swibp features
        </p>
      </div>

      {/* Нижняя часть: Кнопки авторизации и футер */}
      <div className="flex flex-col gap-3 relative z-10 max-w-sm w-full mx-auto pb-4">
        {/* Кнопка Google */}
        <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-4xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm transition-colors cursor-pointer shadow-lg">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.18 21.35 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.2C.44 8.1 0 9.99 0 12s.44 3.9 1.2 5.42l4.08-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.65 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Кнопка Email */}
        <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-4xl bg-zinc-900/80 hover:bg-zinc-900 text-white font-semibold text-sm border border-zinc-800 transition-colors cursor-pointer">
          <Mail className="h-4 w-4 text-zinc-400" />
          Continue with Email
        </button>

        {/* Условия использования */}
        <p className="text-[11px] text-center text-zinc-500 mt-2 px-2">
          By clicking Continue, you agree to our{" "}
          <Link href="#" className="underline hover:text-zinc-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-zinc-300">
            Privacy Policy
          </Link>
        </p>

        {/* Сброс пароля */}
        <div className="text-center mt-2">
          <Link
            href="#"
            className="text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium"
          >
            Reset password
          </Link>
        </div>
      </div>
    </div>
  );
}
