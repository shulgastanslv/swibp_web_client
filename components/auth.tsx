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
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

type View = "login" | "register" | "forgot-password";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();

  const handleSwitchView = (newView: View) => {
    setView(newView);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView("login");
      setEmail("");
      setPassword("");
      setName("");
    }
    onOpenChange?.(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (view === "forgot-password") {
      // TODO: Реализуйте логику отправки письма для сброса пароля
      console.log("Forgot password requested for:", email);
      return;
    }

    if (view === "register") {
      // TODO: Реализуйте логику регистрации (или signIn("credentials", { action: "register", ... }))
      console.log("Register requested for:", { name, email, password });
      return;
    }

    // Логика входа
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: searchParams.get("callbackUrl") || "/",
    });
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: searchParams.get("callbackUrl") || "/",
    });
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md p-0 overflow-hidden gap-0 border-none">
        <div className="p-8 flex flex-col justify-center">

          {view === "login" && (
            <>
              <DialogHeader className="space-y-1 mb-6 text-center">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Welcome back
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Sign in and pick up right where you left off.
                </DialogDescription>
              </DialogHeader>

              <Button
                variant="outline"
                className="w-full h-10 rounded-full text-xs font-medium cursor-pointer transition-all mb-6 flex items-center justify-center gap-2 border-input bg-muted/50 hover:bg-accent hover:text-accent-foreground"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.3l3.7 2.9C6.4 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.5 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.8 7.3C.7 9.5 0 10.7 0 12.5s.7 3 1.8 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.2-6.5-5.2L1.8 15.8C3.7 19.5 7.5 23 12 23z" />
                </svg>
                Continue with Google
              </Button>

              <Divider text="Or continue with email" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-full bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSwitchView("forgot-password")}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors bg-transparent p-0"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 rounded-full bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer transition-all mt-2"
                >
                  Sign in
                </Button>
              </form>

              <div className="text-center mt-6 text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchView("register")}
                  className="text-primary font-medium hover:underline bg-transparent p-0 rounded-4xl"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {/* ==================== REGISTER VIEW ==================== */}
          {view === "register" && (
            <>
              <DialogHeader className="space-y-1 mb-6 text-center">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Create an account
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Sign up to get started and join our community.
                </DialogDescription>
              </DialogHeader>

              <Button
                variant="outline"
                className="w-full h-10 rounded-xl text-xs font-medium cursor-pointer transition-all mb-6 flex items-center justify-center gap-2 border-input bg-muted/50 hover:bg-accent hover:text-accent-foreground"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.3l3.7 2.9C6.4 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.5 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.8 7.3C.7 9.5 0 10.7 0 12.5s.7 3 1.8 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.2-6.5-5.2L1.8 15.8C3.7 19.5 7.5 23 12 23z" />
                </svg>
                Continue with Google
              </Button>

              <Divider text="Or register with email" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer transition-all mt-2"
                >
                  Create account
                </Button>
              </form>

              <div className="text-center mt-6 text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchView("login")}
                  className="text-primary font-medium hover:underline bg-transparent p-0"
                >
                  Sign in
                </button>
              </div>
            </>
          )}

          {/* ==================== FORGOT PASSWORD VIEW ==================== */}
          {view === "forgot-password" && (
            <>
              <DialogHeader className="space-y-1 mb-6 text-center">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Reset password
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer transition-all mt-2"
                >
                  Send reset link
                </Button>
              </form>

              <div className="text-center mt-6 text-xs text-muted-foreground">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchView("login")}
                  className="text-primary font-medium hover:underline bg-transparent p-0"
                >
                  Back to Sign in
                </button>
              </div>
            </>
          )}

          {/* ==================== GLOBAL FOOTER ==================== */}
          <div className="mt-6 pt-4 border-t border-border text-center text-[10px] text-muted-foreground">
            By continuing, you agree to the{" "}
            <button className="underline hover:text-foreground transition-colors bg-transparent p-0">
              Terms
            </button>{" "}
            and{" "}
            <button className="underline hover:text-foreground transition-colors bg-transparent p-0">
              Privacy Policy
            </button>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Divider = ({ text }: { text: string }) => (
  <div className="relative flex items-center justify-center mb-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    <span className="relative px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-semibold bg-background backdrop-blur-md ">
      {text}
    </span>
  </div>
);
