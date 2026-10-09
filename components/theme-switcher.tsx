"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcherMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <DropdownMenuItem disabled className="text-sm">
        <Sun className="w-3.5 h-3.5 mr-2 opacity-50" />
        <span>Theme</span>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer text-sm gap-2">
        {theme === "dark" ? (
          <Moon className="w-3.5 h-3.5 text-muted-foreground" />
        ) : theme === "light" ? (
          <Sun className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-36 text-sm">
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between text-sm"
            onClick={() => setTheme("light")}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="w-3.5 h-3.5" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between text-sm"
            onClick={() => setTheme("dark")}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="w-3.5 h-3.5" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between text-sm"
            onClick={() => setTheme("system")}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="w-3.5 h-3.5" />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
