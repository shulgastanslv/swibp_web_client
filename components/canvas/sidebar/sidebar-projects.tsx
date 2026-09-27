"use client";

import { useEffect, useState } from "react";
import { Search, Bookmark, MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import {
  getUserProjects,
  toggleSaveProject,
  deleteProject,
  getProjectById,
  type ProjectListItem,
} from "@/actions/projects";
import { useCanvasStore } from "@/store/useCanvasStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

interface SidebarProjectsProps {
  userId?: string; // Опциональный пропс, если нужно прокинуть сверху
}

type Filter = "all" | "saved";

export function SidebarProjects({ userId: propsUserId }: SidebarProjectsProps) {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentProjectId, loadProjectState } = useCanvasStore();

  const userId = propsUserId || (session?.user as { id?: string })?.id;

  const fetchProjects = async () => {
    if (!userId) return;
    setLoading(true);
    // Передаем userId
    const res = await getUserProjects(userId);
    if (res.success && res.projects) {
      setProjects(res.projects);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId, status]);

  const handleToggleSave = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!userId) return;

    // Оптимистичное обновление UI
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isSaved: !p.isSaved } : p))
    );

    // Передаем userId и projectId
    await toggleSaveProject(userId, projectId);
  };

  const handleSelectProject = async (id: string) => {
    if (id === currentProjectId) return;
    const res = await getProjectById(id);
    if (res.project) {
      await loadProjectState(res.project);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProject(id);
  };

  const visible = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.isSaved;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!userId) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        Войдите в аккаунт, чтобы сохранять и управлять проектами.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 text-xs">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск проектов…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-7 rounded-full border border-border/60 bg-muted/30 text-xs pl-7 pr-2 outline-none placeholder:text-muted-foreground/60 focus:border-border transition-colors"
        />
      </div>

      {/* Фильтр All / Saved */}
      <div className="bg-muted/50 p-0.5 rounded-full border border-border/40 w-fit flex gap-0.5">
        {(["all", "saved"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-0.5 rounded-full text-[11px] capitalize transition-all ${
              filter === f
                ? "bg-background text-foreground shadow-2xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Все" : "Сохранённые"}
          </button>
        ))}
      </div>

      {/* Список проектов */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : visible.length === 0 ? (
        <p className="text-center text-[11px] text-muted-foreground py-6">
          Проектов не найдено
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {visible.map((p) => {
            const isActive = p.id === currentProjectId;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`group flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-muted/50 text-foreground"
                }`}
              >
                {/* Кнопка закладки */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, p.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 transition-colors ${
                      p.isSaved
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30 hover:text-muted-foreground/70"
                    }`}
                  />
                </button>

                <span className="flex-1 truncate text-xs">{p.title}</span>

                <span className="text-[10px] text-muted-foreground font-mono shrink-0 group-hover:hidden">
                  {p.slideCount} сл.
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="hidden group-hover:flex items-center justify-center p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={(e) => handleDelete(e as any, p.id)}
                      className="text-xs text-destructive focus:text-destructive cursor-pointer gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Удалить</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
