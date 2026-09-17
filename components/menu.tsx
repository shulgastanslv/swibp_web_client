"use client";

import React, { useState } from "react";
import {
  User,
  Palette,
  ArrowUpRight,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Languages,
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

interface MenuNavProps {
  isOpen?: boolean;
  onOpenChange?: (flag: boolean) => void;
}

export function MenuNav({ isOpen, onOpenChange }: MenuNavProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full overflow-hidden p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isAuthenticated && session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-52 p-3 backdrop-blur-md border-none text-popover-foreground rounded-4xl"
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
                <DropdownMenuItem>
                  <Languages className="h-3.5 w-3.5" />
                  <span>Language</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MoonIcon className="h-3.5 w-3.5" />
                  <span>Appearance</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => signOut()}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthModal isOpen={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
