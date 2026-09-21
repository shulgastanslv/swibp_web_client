"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Mockup {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

const mockups: Mockup[] = [
  { id: "iphone", name: "iPhone", category: "Devices", thumbnail: "/mockups/iphone.png" },
  { id: "macbook", name: "MacBook", category: "Devices", thumbnail: "/mockups/macbook.png" },
  { id: "ipad", name: "iPad", category: "Devices", thumbnail: "/mockups/ipad.png" },
  { id: "tshirt", name: "T-Shirt", category: "Apparel", thumbnail: "/mockups/tshirt.png" },
  { id: "mug", name: "Coffee Mug", category: "Products", thumbnail: "/mockups/mug.png" },
  { id: "book", name: "Book", category: "Print", thumbnail: "/mockups/book.png" },
];

const categories = ["All", "Devices", "Apparel", "Products", "Print"];

export function MockupsPanel() {
  const selectedCategory = "All";

  const filteredMockups = selectedCategory === "All"
    ? mockups
    : mockups.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          placeholder="Search mockups..."
          className="pl-7 h-7 text-xs"
        />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="h-6 text-[10px] px-2 whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[300px] w-full">
        <div className="grid grid-cols-2 gap-2 p-1">
          {filteredMockups.map((mockup) => (
            <Button
              key={mockup.id}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto p-3 hover:bg-accent"
            >
              <div className="w-full aspect-square bg-muted rounded-md overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
              </div>
              <span className="text-xs font-medium">{mockup.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
