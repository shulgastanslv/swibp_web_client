"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, Bookmark, Loader2, X, Library, Ratio } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  getUserProjects,
  toggleSaveProject,
  deleteProject,
  updateProjectTitle,
  duplicateProject,
  type ProjectListItem,
} from "@/actions/projects";
import { useProject } from "@/hooks/use-project";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { GalleryMenu } from "@/components/canvas/sidebar/gallery-menu";
import { Input } from "@/components/ui/input";
import { GalleryCard, GallerySection, carouselMeta, splitGallery } from "@/components/canvas/sidebar/gallery-card";
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
  const [showAll, setShowAll] = useState(false);

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

  const handleRename = async (id: string, title: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
    const res = await updateProjectTitle(id, title);
    if (!res.success) {
      void fetchProjects();
      return;
    }
    if (id === currentProjectId) useCanvasStore.getState().setProjectTitle(title);
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicateProject(id);
    if (res.success) void fetchProjects();
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

  const filtering = search.trim().length > 0 || filter !== "all" || ratio !== "all";
  const { recent, more } = splitGallery(visibleProjects, showAll || filtering);

  if (!userId) {
    return (
      <div className="p-4 text-center text-[13px] text-muted-foreground">
        Sign in to save and manage projects.
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4 p-1">

      <div className="relative flex items-center px-2 gap-2">
        <Search className="absolute left-6 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full h-8 pl-10 pr-10 text-[13px] bg-muted/50 rounded-full placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
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
        <p className="text-center text-[13px] text-muted-foreground py-6">
          No projects found
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <GallerySection
            title={filtering ? "Projects" : "Recently used"}
            action={!filtering && more.length > 0 ? (showAll ? "Show less" : "See all") : undefined}
            onAction={() => setShowAll((open) => !open)}
          >
            {recent.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                active={p.id === currentProjectId}
                busy={loadingId === p.id}
                onOpen={() => void handleSelectProject(p.id)}
                onToggleSave={(e) => void handleToggleSave(e, p.id)}
                onDelete={() => void handleDelete(p.id)}
                onRename={(title) => void handleRename(p.id, title)}
                onDuplicate={() => void handleDuplicate(p.id)}
              />
            ))}
          </GallerySection>
          {more.length > 0 ? (
            <GallerySection title="More projects">
              {more.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  active={p.id === currentProjectId}
                  busy={loadingId === p.id}
                  onOpen={() => void handleSelectProject(p.id)}
                  onToggleSave={(e) => void handleToggleSave(e, p.id)}
                  onDelete={() => void handleDelete(p.id)}
                  onRename={(title) => void handleRename(p.id, title)}
                  onDuplicate={() => void handleDuplicate(p.id)}
                />
              ))}
            </GallerySection>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  active,
  busy,
  onOpen,
  onToggleSave,
  onDelete,
  onRename,
  onDuplicate,
}: {
  project: ProjectListItem;
  active: boolean;
  busy: boolean;
  onOpen: () => void;
  onToggleSave: (event: React.MouseEvent) => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onDuplicate: () => void;
}) {
  return (
    <GalleryCard
      title={project.title}
      meta={carouselMeta(project.slideCount, project.aspectRatio)}
      previewUrl={project.previewUrl}
      busy={busy}
      active={active}
      onClick={onOpen}
      menu={
        <div onClick={(event) => event.stopPropagation()}>
          <GalleryMenu
            title={project.title}
            createdAt={project.createdAt}
            createdBy={project.authorName}
            ratio={project.aspectRatio}
            onRename={onRename}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            starred={project.isSaved}
            onStar={() => onToggleSave({ stopPropagation() {} } as React.MouseEvent)}
          />
        </div>
      }
      badge={
        <button
          type="button"
          onClick={onToggleSave}
          title={project.isSaved ? "Remove from saved" : "Save"}
          className="flex size-5 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border/60 transition-colors hover:text-foreground"
        >
          <Bookmark className={cn("size-3", project.isSaved && "fill-primary text-primary")} />
        </button>
      }
    />
  );
}
