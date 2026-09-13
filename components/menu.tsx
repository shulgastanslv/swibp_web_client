"use client";

import React, { useState } from "react";
import {
  User,
  Palette,
  ArrowUpRight,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthModal } from "@/components/auth";
import { MoonIcon, SlideshowIcon, UserIcon } from "@phosphor-icons/react";
import { useSession, signOut } from "next-auth/react";
import AccountDialog from "./account/account_modal";

interface MenuNavProps {
  isOpen?: boolean;
  onOpenChange?: (flag: boolean) => void;
}

export function MenuNav({ isOpen, onOpenChange }: MenuNavProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {isAuthenticated && session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <Image height={25} width={25} src="/Logo.svg" alt="Logo" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-64 p-3 bg-background/80 backdrop-blur-md text-popover-foreground rounded-4xl shadow-lg"
        >
          {!isAuthenticated ? (
            <div className="space-y-1">
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center justify-between px-2 py-1.5 rounded-4xl text-sm font-medium cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Log in
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              </DropdownMenuItem>

              <div className="px-2 py-1.5 text-xs text-muted-foreground leading-snug">
                Join to save projects & sync settings.
              </div>
            </div>
          ) : (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setIsAccountOpen(true);
                  }}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-4xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer focus:bg-accent focus:text-accent-foreground"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2.5 px-2 py-1.5 rounded-4xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer focus:bg-accent focus:text-accent-foreground">
                  <SlideshowIcon className="h-3.5 w-3.5" />
                  <span>My Projects</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2.5 px-2 py-1.5 rounded-4xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer focus:bg-accent focus:text-accent-foreground">
                  <MoonIcon className="h-3.5 w-3.5" />
                  <span>Appearance</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-border/50 my-1" />

              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-4xl text-sm text-destructive hover:text-destructive/90 hover:bg-destructive/10 cursor-pointer focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </>
          )}

          <div className="mt-1 pt-1 border-t border-border/50">
            <div className="grid grid-cols-2 gap-0.5 px-0.5">
              <FooterLink href="#">Feedback</FooterLink>
              <FooterLink href="#">What`s new</FooterLink>
            </div>

            <div className="px-2 py-1.5 flex items-center justify-between text-xs text-muted-foreground/60 tracking-wide">
              <span>v1.5.93</span>
              <div className="flex items-center gap-1.5">
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
                <span>•</span>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthModal isOpen={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <AccountDialog isOpen={isAccountOpen} onOpenChange={setIsAccountOpen} />
    </>
  );
}

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <DropdownMenuItem
    asChild
    className="px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer focus:bg-accent"
  >
    <Link
      href={href}
      className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground w-full transition-colors"
    >
      <span>{children}</span>
      <ArrowUpRight className="h-2.5 w-2.5 opacity-50" />
    </Link>
  </DropdownMenuItem>
);
