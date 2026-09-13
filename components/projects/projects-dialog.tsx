"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowUpRight,
  Trash2,
  Search,
  FolderOpen,
} from "lucide-react";
import { SlideshowIcon } from "@phosphor-icons/react/dist/ssr";

interface Project {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  status: "active" | "archived";
}

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Landing Page Redesign", description: "New marketing website", lastEdited: "2h ago", status: "active" },
  { id: "2", name: "Dashboard Analytics", description: "Internal metrics tracking", lastEdited: "2d ago", status: "active" },
  { id: "3", name: "Mobile App Prototype", description: "Figma to React Native", lastEdited: "1w ago", status: "archived" },
];

interface ProjectsDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
  onCreateProject?: () => void;
}

export function ProjectsDialog({
  isOpen,
  onOpenChange,
  onSelectProject,
  onDeleteProject,
  onCreateProject,
}: ProjectsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = MOCK_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden gap-0 rounded-3xl p-4 sm:max-w-2xl border-none">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                Projects
                <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/50 tabular-nums">
                  {filteredProjects.length}
                </span>
              </DialogTitle>
            </DialogHeader>

            <Button
              size="sm"
              onClick={onCreateProject}
              className="h-8 px-3 rounded-full text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New
            </Button>
          </div>

          {/* Minimalist Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-2xl border border-border/40 bg-secondary/40 pl-9 pr-4 text-xs font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-[55vh] overflow-y-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <FolderOpen className="h-7 w-7 text-muted-foreground/30 mb-2 stroke-[1.5]" />
              <p className="text-xs font-medium text-foreground/70">
                No matching projects
              </p>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                {searchQuery ? "Refine your search query" : "Get started by creating a new space"}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                  <th className="py-2.5 pl-6 pr-3 font-medium">Name</th>
                  <th className="py-2.5 px-3 font-medium">Description</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Modified</th>
                  <th className="py-2.5 pl-3 pr-6 font-medium text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-xs">
                {filteredProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onSelect={onSelectProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectRow({
  project,
  onSelect,
  onDelete,
}: {
  project: Project;
  onSelect?: (project: Project) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <tr
      onClick={() => onSelect?.(project)}
      className="group hover:bg-secondary/40 transition-colors cursor-pointer"
    >
      <td className="py-3 pl-6 pr-3">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 border border-border/30">
            <SlideshowIcon className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
          </div>
          <span className="font-semibold text-foreground truncate max-w-[140px]">
            {project.name}
          </span>
        </div>
      </td>

      <td className="py-3 px-3 text-muted-foreground/70 truncate max-w-[180px]">
        {project.description}
      </td>

      <td className="py-3 px-3">
        {project.status === "archived" ? (
          <span className="inline-flex text-[10px] font-medium text-muted-foreground/60 bg-secondary/80 px-2 py-0.5 rounded-md">
            archived
          </span>
        ) : (
          <span className="inline-flex text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            active
          </span>
        )}
      </td>

      <td className="py-3 px-3 text-right text-[11px] text-muted-foreground/50 tabular-nums">
        {project.lastEdited}
      </td>

      <td className="py-3 pl-3 pr-6 text-right">
        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(project);
            }}
            className="h-6 w-6 rounded-lg hover:bg-background/80"
          >
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(project.id);
            }}
            className="h-6 w-6 rounded-lg hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
