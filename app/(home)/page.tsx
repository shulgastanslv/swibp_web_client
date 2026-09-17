"use client";
import React, { useState } from "react";
import {
  Search,
  Clock,
  Users,
  FileText,
  Folder,
  Trash2,
  HelpCircle,
  Plus,
  ChevronDown,
  LayoutGrid,
  List,
  FolderOpen,
  SlidersHorizontal,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const projects = [
  {
    id: 1,
    title: "5 AI Tools You Missed in 2026",
    edited: "Edited 1 hour ago",
    slidesCount: 7,
    platform: "linkedin",
    previewBg: "bg-muted",
    previewType: "carousel-deck",
  },
  {
    id: 2,
    title: "Why Dark UI Converts Better",
    edited: "Edited 24 days ago",
    slidesCount: 5,
    platform: "instagram",
    previewBg: "bg-muted",
    previewType: "carousel-deck-dark",
  },
  {
    id: 3,
    title: "Productivity System for Founders",
    edited: "Edited 1 month ago",
    slidesCount: 10,
    platform: "telegram",
    previewBg: "bg-muted",
    previewType: "carousel-deck-green",
  },
];

export default function WorkspaceScreen() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
      {/* ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ (SIDEBAR) */}
      <aside className="w-64 bg-sidebar border-r border-border/80 flex flex-col justify-between p-3 select-none">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                      S
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium text-foreground truncate">
                        Stanislav Shulga
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        pro@carousel.io
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-none text-xs text-popover-foreground w-52 rounded-xl">
                <DropdownMenuItem>Account settings</DropdownMenuItem>
                <DropdownMenuItem>Brand kits</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator className="bg-border/80" />
          <nav className="flex flex-col gap-0.5 text-xs">
            <span className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Workspace
            </span>
            <a
              href="#"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            >
              <Folder className="h-3.5 w-3.5 text-primary" /> My Library
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md bg-accent/60 text-foreground font-medium"
            >
              <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Recents
            </a>
          </nav>

          <Separator className="bg-border/80 my-0.5" />

          <div className="flex flex-col gap-0.5 text-xs">
            <a
              href="#"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-3.5 w-3.5" /> Drafts
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                3
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" /> Trash
            </a>
          </div>

          <Separator className="bg-border/80 my-0.5" />

          {/* Starred / Collections */}
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Stars
            </span>
            <a
              href="#"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            >
              <Folder className="h-3.5 w-3.5" /> Top Performing
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            >
              <Folder className="h-3.5 w-3.5" /> Q3 Launch
            </a>
          </div>
        </div>

      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border/80 flex  bg-sidebar  items-center justify-between px-6 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search carousels, hooks, keywords..."
                className="pl-9 h-8 bg-muted/60 border-border text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button className="text-xs h-8 px-3.5 rounded-lg bg-blue-400 hover:bg-blue-400/80 text-white gap-1.5" onClick={() => {router.push("/project")}}>
              <Plus className="h-3.5 w-3.5" /> Create
            </Button>
            <Button
              variant="outline"
              className="text-xs h-8 px-3 rounded-lg border-border bg-secondary/60 hover:bg-accent text-foreground gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Brand Kit
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h1 className="text-base font-semibold text-foreground flex items-center gap-1.5">
                My Library{" "}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </h1>
              <span className="text-xs text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                3 projects
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-secondary/60 border-border text-foreground text-xs h-7 px-2.5"
                  >
                    Last modified{" "}
                    <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border text-xs text-popover-foreground">
                  <DropdownMenuItem>Last modified</DropdownMenuItem>
                  <DropdownMenuItem>Most slides</DropdownMenuItem>
                  <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator
                orientation="vertical"
                className="h-5 bg-border mx-1"
              />

              {/* Переключатель сетки/списка */}
              <div className="flex items-center bg-secondary/60 border border-border rounded-md p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`h-6 w-6 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`h-6 w-6 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* СЕТКА ПРОЕКТОВ (КАРУСЕЛЕЙ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {projects.map((item) => (
              <Card
                key={item.id}
                className="bg-card border-none hover:shadow-md transition-all rounded-xl overflow-hidden group cursor-pointer flex flex-col shadow-none"
              >
                <CardContent className="p-3 pb-3 flex-1 flex flex-col justify-between">
                  <div
                    className={`w-full aspect-square rounded-lg ${item.previewBg} mb-3 relative overflow-hidden flex flex-col items-center justify-center p-3 group-hover:shadow-lg transition-all`}
                  >
                    <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-zinc-300">
                      {item.slidesCount} slides
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center relative mt-4">
                      <div className="w-4/5 h-4/5 bg-accent/50 rounded-md border border-border/50 absolute translate-x-2 -translate-y-2 scale-95 opacity-50" />
                      <div className="w-4/5 h-4/5 bg-background rounded-md border border-border relative flex flex-col p-2.5 shadow-xl">
                        <div className="w-1/2 h-2 bg-primary/80 rounded-full mb-2" />
                        <div className="w-full h-1.5 bg-muted-foreground/40 rounded-full mb-1" />
                        <div className="w-4/5 h-1.5 bg-muted-foreground/40 rounded-full" />
                        <div className="mt-auto flex items-center justify-between">
                          <div className="w-4 h-4 rounded-full bg-accent" />
                          <span className="text-[8px] text-muted-foreground font-mono">
                            01/{item.slidesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.edited}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-popover border-border text-xs text-popover-foreground">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate deck</DropdownMenuItem>
                        <DropdownMenuItem>Export PDF/PNG</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-destructive">
                          Move to trash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-5 right-5">
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-full bg-secondary hover:bg-accent text-secondary-foreground border border-border shadow-xl"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
