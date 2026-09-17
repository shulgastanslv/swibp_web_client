"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CollapsibleGroupProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleGroup({
  id,
  title,
  children,
  defaultOpen = true,
}: CollapsibleGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(`group-${id}`, String(newState));
  };

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out ",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
