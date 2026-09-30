"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Layers,
  Save,
  Download,
  MousePointer2,
  Sparkles,
  Crosshair,
  ImageIcon,
  Filter,
  Share2,
  Workflow,
  LayoutTemplate,
  CircleHelp,
  HelpCircle,
} from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIPS = [
  {
    icon: Crosshair,
    title: "Привязка объектов",
    text: "Удерживайте Ctrl/⌘ при перетаскивании — объект магнитится к центру холста, краям и другим объектам. Появляются красные гайды.",
  },
  {
    icon: Layers,
    title: "Слайды карусели",
    text: "Добавляйте слайды внизу холста. Порядок можно менять стрелками в навигаторе. Каждый слайд — отдельный кадр карусели.",
  },
  {
    icon: Workflow,
    title: "Auto Flow",
    text: "Если объект выходит за край слайда, редактор предложит создать следующий слайд и перенести туда контент.",
  },
  {
    icon: Save,
    title: "Сохранение",
    text: "Save пишет проект и все слайды в облако. Нужна авторизация. Несохранённые правки помечаются рядом с названием.",
  },
  {
    icon: Download,
    title: "Экспорт",
    text: "Export собирает PNG/JPEG всех слайдов в ZIP или отдельные файлы в полном разрешении.",
  },
  {
    icon: Sparkles,
    title: "Публикация шаблона",
    text: "Publish отправляет текущую карусель в библиотеку шаблонов для повторного использования.",
  },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/70 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40 text-left space-y-1">
          <DialogTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            Справка
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 max-h-[min(70vh,560px)] overflow-y-auto">
          <section className="space-y-2.5">
            <div className="grid gap-2">
              {TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className="flex gap-3 rounded-xl bg-muted/30 px-3 py-2.5"
                >
                  <tip.icon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-medium text-foreground">{tip.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
