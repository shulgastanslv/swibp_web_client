"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, Bookmark, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  getUserProjects,
  toggleSaveProject,
  deleteProject,
  getProjectById,
  type ProjectListItem,
} from "@/actions/projects";
import { useCanvasStore } from "@/store/useCanvasStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectActionsDropdown } from "./project_actions_dropdown";

type Filter = "all" | "saved";

export function SidebarProjects() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentProjectId } = useCanvasStore();
  const userId = (session?.user as { id?: string })?.id;

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getUserProjects(userId);
      if (res.success && res.projects) {
        setProjects(res.projects);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId, fetchProjects]);

  const handleToggleSave = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!userId) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isSaved: !p.isSaved } : p))
    );

    await toggleSaveProject(userId, projectId);
  };

  const handleSelectProject = async (id: string) => {
    if (id === currentProjectId) return;
    const res = await getProjectById(id);
    if (res?.project) {
      // Инициализация выбранного проекта
    }
  };

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProject(id);
  };

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesFilter = filter === "all" || p.isSaved;
      const matchesSearch = !query || p.title.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  if (!userId) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        Войдите в аккаунт, чтобы сохранять и управлять проектами.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 text-xs p-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Поиск проектов…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs rounded-full bg-muted/30 border-border/60"
        />
      </div>
      <div className="bg-muted/50 p-0.5 rounded-full border border-border/40 w-fit flex gap-0.5">
        {(["all", "saved"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3 py-0.5 rounded-full text-[11px] transition-all",
              filter === tab
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "all" ? "Все" : "Сохранённые"}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : visibleProjects.length === 0 ? (
        <p className="text-center text-[11px] text-muted-foreground py-6">
          Проектов не найдено
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {visibleProjects.map((p) => {
            const isActive = p.id === currentProjectId;

            return (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={cn(
                  "group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-muted/50 text-foreground"
                )}
              >
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, p.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  <Bookmark
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      p.isSaved
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40 hover:text-muted-foreground"
                    )}
                  />
                </button>

                <span className="flex-1 truncate text-xs">{p.title}</span>

                <span className="text-[10px] text-muted-foreground font-mono shrink-0 group-hover:hidden">
                  {p.slideCount} сл.
                </span>

                <ProjectActionsDropdown onDelete={() => handleDelete(p.id)} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
