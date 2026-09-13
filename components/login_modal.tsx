"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CreateUser } from "@/actions/user";

interface LoginModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await CreateUser();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-xl p-0 overflow-hidden rounded-4xl gap-0 bg-background/50 backdrop-blur-3xl">
        <div className="p-8 flex flex-col justify-center bg-background/50 backdrop-blur-3xl">
          <DialogHeader className="space-y-1 mb-6 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-white text-center">
              Welcome back
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 text-center">
              Sign in and pick up right where you left off.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl  hover:text-white text-xs font-medium cursor-pointer transition-all mb-6 flex items-center justify-center gap-2"
            onClick={() => {}}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.3l3.7 2.9C6.4 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.5 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.8 7.3C.7 9.5 0 10.7 0 12.5s.7 3 1.8 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.2-6.5-5.2L1.8 15.8C3.7 19.5 7.5 23 12 23z"
              />
            </svg>
            Continue with Google
          </Button>
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative px-3 text-[10px] tracking-wider uppercase text-zinc-500 font-semibold">
              Or continue with email
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl bg-zinc-900/50 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-zinc-300">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 rounded-xl bg-zinc-900/50 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold cursor-pointer transition-all mt-2"
            >
              Sign in
            </Button>
          </form>
          <div className="text-center mt-6 text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-white font-medium hover:underline">
              Sign up
            </Link>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[10px] text-zinc-500">
            By continuing, you agree to the{" "}
            <Link href="#" className="underline hover:text-zinc-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-zinc-300">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
