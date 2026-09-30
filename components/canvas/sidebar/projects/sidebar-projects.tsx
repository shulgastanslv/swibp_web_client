"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, Bookmark, Loader2, X, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  getUserProjects,
  toggleSaveProject,
  deleteProject,
  type ProjectListItem,
} from "@/actions/projects";
import { useProject } from "@/hooks/use-project";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { ProjectActionsDropdown } from "./project_actions_dropdown";

type Filter = "all" | "saved";

export function SidebarProjects() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentProjectId = useCanvasStore((s) => s.currentProjectId);
  const { loadProject } = useProject();
  const userId = session?.user?.id;

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getUserProjects();
      if (res.success) setProjects(res.projects);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) void fetchProjects();
  }, [userId, fetchProjects]);

  const handleToggleSave = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!userId) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isSaved: !p.isSaved } : p)),
    );

    const res = await toggleSaveProject(projectId);
    if (!res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, isSaved: !p.isSaved } : p)),
      );
    }
  };

  const handleSelectProject = async (id: string) => {
    if (id === currentProjectId || loadingId) return;
    setLoadingId(id);
    try {
      const res = await loadProject(id);
      if (!res.success) {
        console.error("loadProject failed:", res.error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    const res = await deleteProject(id);
    if (!res.success) {
      void fetchProjects();
      return;
    }
    if (id === currentProjectId) {
      useCanvasStore.getState().resetToBlankProject();
    }
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
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-medium">
          Проекты
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {visibleProjects.length}
          </span>
          <button
            type="button"
            title="Обновить"
            onClick={() => void fetchProjects()}
            className="h-6 w-6 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск проектов..."
          className="w-full h-8 pl-8 pr-7 text-xs bg-muted/50 rounded-full placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
        {(["all", "saved"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              "h-6 shrink-0 px-2.5 rounded-full text-[10px] transition-colors",
              filter === tab
                ? "bg-foreground text-background"
                : "bg-muted/30 text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === "all" ? "Все" : "Сохранённые"}
          </button>
        ))}
      </div>

      {loading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : visibleProjects.length === 0 ? (
        <p className="text-center text-[11px] text-muted-foreground py-6">
          Проектов не найдено
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleProjects.map((p) => {
            const isActive = p.id === currentProjectId;
            const busy = loadingId === p.id;

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => void handleSelectProject(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    void handleSelectProject(p.id);
                  }
                }}
                className={cn(
                  "group flex flex-col p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 text-left gap-2 transition-colors cursor-pointer",
                  isActive && "bg-muted/70",
                  busy && "opacity-60",
                )}
              >
                <div className="w-full h-32 rounded-lg bg-card overflow-hidden flex items-center justify-center relative">
                  {p.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.previewUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-xs font-bold text-foreground px-3 text-center leading-snug">
                      {p.title}
                    </span>
                  )}
                  {busy && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => void handleToggleSave(e, p.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                      title={p.isSaved ? "Убрать из сохранённых" : "Сохранить"}
                    >
                      <Bookmark
                        className={cn(
                          "h-3.5 w-3.5",
                          p.isSaved && "fill-primary text-primary",
                        )}
                      />
                    </button>
                    <div
                      className="rounded-full bg-background/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ProjectActionsDropdown
                        onDelete={() => void handleDelete(p.id)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {p.slideCount} сл. · {p.aspectRatio}
                      {isActive ? " · Открыт" : ""}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-background shrink-0">
                    {busy ? "…" : isActive ? "Открыт" : "Открыть"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
