"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Globe, Lock } from "lucide-react";

export interface PublishTemplateData {
  name: string;
  description: string;
  category: string;
  visibility: "public" | "private";
}

interface PublishTemplateDialogProps {
  onPublish: (data: PublishTemplateData) => Promise<void> | void;
  isPublishing?: boolean;
}

export function PublishTemplateDialog({
  onPublish,
  isPublishing = false,
}: PublishTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("instagram");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onPublish({ name, description, category, visibility });

    if (!isPublishing) {
      setName("");
      setDescription("");
      setCategory("instagram");
      setVisibility("public");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full px-6 gap-2 font-medium">
          Publish
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] overflow-hidden gap-0 rounded-4xl p-4">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold">Publish Template</DialogTitle>
            <DialogDescription className="text-sm">
              Share your design with the community or save it privately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor="template-name" className="text-xs font-medium">Name</Label>
              <Input
                id="template-name"
                className="rounded-xl h-10"
                placeholder="e.g., Minimalist Business Post"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-desc" className="text-xs font-medium">Description</Label>
              <Textarea
                id="template-desc"
                placeholder="Briefly describe this template..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none min-h-[80px] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-category" className="text-xs font-medium">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Visibility</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility("public")}
                    className={`flex-1 flex items-center justify-center min-h-8 rounded-xl border text-xs font-medium transition-all ${
                      visibility === "public"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-transparent text-muted-foreground border-input hover:bg-muted"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility("private")}
                    className={`flex-1 flex items-center justify-center h-8 rounded-xl border text-xs font-medium transition-all ${
                      visibility === "private"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-transparent text-muted-foreground border-input hover:bg-muted"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-3 px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPublishing}
              className="rounded-full h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isPublishing}
              className="rounded-full h-10"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
