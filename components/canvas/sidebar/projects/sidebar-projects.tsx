"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, Bookmark, Loader2, X, Library, Ratio } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { CarouselStack } from "@/components/canvas/sidebar/carousel-stack";
import { FilterMenu } from "@/components/canvas/sidebar/filter-menu";

type Filter = "all" | "saved";

const RATIOS = ["4:5", "1:1", "9:16", "16:9"] as const;

export function SidebarProjects() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<Filter>("all");
  const [ratio, setRatio] = useState<string>("all");
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

  useEffect(() => {
    const onChanged = () => {
      if (userId) void fetchProjects();
    };
    window.addEventListener("core:projects-changed", onChanged);
    return () => window.removeEventListener("core:projects-changed", onChanged);
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
      const matchesRatio = ratio === "all" || p.aspectRatio === ratio;
      const matchesSearch = !query || p.title.toLowerCase().includes(query);
      return matchesFilter && matchesRatio && matchesSearch;
    });
  }, [projects, filter, ratio, search]);

  if (!userId) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        Sign in to save and manage projects.
      </div>
    );
  }


  const formatDate = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    if (diff < 1000 * 60 * 60 * 24) {
      return "Today";
    } else if (diff < 1000 * 60 * 60 * 24 * 2) {
      return "Yesterday";
    } else {
      return new Date(date).toLocaleDateString();
    }
  }
  
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          Your projects
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            {visibleProjects.length}
          </span>
        </div>
      </div>

      <div className="relative flex items-center px-2 gap-2">
        <Search className="absolute left-6 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full h-8 pl-10 pr-10 text-xs bg-muted/50 rounded-full placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      <div className="flex flex-row justify-between">
        <FilterMenu
          icon={Library}
          value={filter}
          onChange={(id) => setFilter(id as Filter)}
          groups={[
            {
              label: "Library",
              options: [
                { id: "all", label: "All" },
                { id: "saved", label: "Saved" },
              ],
            },
          ]}
        />
        <FilterMenu
          icon={Ratio}
          value={ratio}
          onChange={setRatio}
          groups={[
            {
              label: "Ratio",
              options: [
                { id: "all", label: "All ratios" },
                ...RATIOS.map((item) => ({ id: item, label: item })),
              ],
            },
          ]}
        />
      </div>
      </div>


      {loading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : visibleProjects.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-6">
          No projects found
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
                <CarouselStack
                  slideCount={p.slideCount}
                  previewUrl={p.previewUrl}
                  createdAt={formatDate(p.createdAt)}
                  busy={busy}
                >
                  <div className="absolute top-1.5 right-1.5 flex items-start gap-0.5 z-10">
                    <button
                      type="button"
                      onClick={(e) => void handleToggleSave(e, p.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                      title={p.isSaved ? "Remove from saved" : "Save"}
                    >
                      <Bookmark
                        className={cn(
                          "h-3.5 w-3.5",
                          p.isSaved && "fill-primary text-primary",
                        )}
                      />
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ProjectActionsDropdown
                        onDelete={() => void handleDelete(p.id)}
                      />
                    </div>
                  </div>
                </CarouselStack>

                <div className="flex items-center justify-between w-full gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate line-clamp-1 max-w-full text-wrap">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate line-clamp-1">
                      {p.slideCount} slides · {p.aspectRatio}
                      {isActive ? " · Open" : ""}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-background shrink-0">
                    {busy ? "…" : isActive ? "Open" : "Open"}
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
