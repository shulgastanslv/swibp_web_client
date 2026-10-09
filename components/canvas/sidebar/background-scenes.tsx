"use client";

import { useEffect, useRef, useState } from "react";
import { useCanvasManager } from "@/context/canvas-manager";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
import { cn } from "@/lib/utils";
import {
  renderSceneDataUrl,
  scenesIn,
  sceneThumbUrl,
  type ScenePreset,
} from "@/lib/canvas/background-scenes";

function SceneThumb({ id, width, height }: { id: string; width: number; height: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(sceneThumbUrl(id, width, height));
  }, [id, width, height]);

  return src ? (
    <img src={src} alt="" className="h-full w-full object-cover" />
  ) : (
    <span className="block h-full w-full bg-muted" />
  );
}

function SceneButton({
  scene,
  selected,
  aspect,
  thumb,
  onClick,
}: {
  scene: ScenePreset;
  selected: boolean;
  aspect: string;
  thumb: { width: number; height: number };
  onClick: () => void;
}) {
  return (
    <button type="button" title={scene.label} onClick={onClick} className="min-w-0 text-left">
      <span
        className={cn(
          "block overflow-hidden rounded-xl border bg-muted transition-colors",
          selected ? "border-foreground ring-2 ring-foreground/70" : "border-border/60 hover:border-foreground/30",
        )}
      >
        <span className={cn("block w-full", aspect)}>
          <SceneThumb id={scene.id} width={thumb.width} height={thumb.height} />
        </span>
      </span>
      <span className="mt-1 block truncate text-center text-[10px] leading-none text-muted-foreground">
        {scene.label}
      </span>
    </button>
  );
}

function nativeSize(canvas: { width?: number; height?: number; getZoom: () => number }) {
  const zoom = canvas.getZoom() || 1;
  return {
    width: Math.max(1, Math.round((canvas.width || 1080) / zoom)),
    height: Math.max(1, Math.round((canvas.height || 1080) / zoom)),
  };
}

export function BackgroundScenes() {
  const manager = useCanvasManager();
  const [selected, setSelected] = useState<string | null>(null);
  const seq = useRef(0);

  const apply = (id: string) => {
    if (!manager) return;
    setSelected(id);
    const token = ++seq.current;
    const size = nativeSize(manager.canvas);
    const url = renderSceneDataUrl(id, size.width, size.height);
    if (!url || token !== seq.current) return;
    void manager.setBackground({ type: "image", url });
  };

  return (
    <>
      <CollapsibleGroup id="background-style" title="Style">
        <div className="grid grid-cols-3 gap-2">
          {scenesIn("style").map((scene) => (
            <SceneButton
              key={scene.id}
              scene={scene}
              aspect="aspect-square"
              thumb={{ width: 96, height: 96 }}
              selected={selected === scene.id}
              onClick={() => apply(scene.id)}
            />
          ))}
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="background-scenes" title="Scenes">
        <div className="grid grid-cols-3 gap-2">
          {scenesIn("scene").map((scene) => (
            <SceneButton
              key={scene.id}
              scene={scene}
              aspect="aspect-4/5"
              thumb={{ width: 80, height: 100 }}
              selected={selected === scene.id}
              onClick={() => apply(scene.id)}
            />
          ))}
        </div>
      </CollapsibleGroup>
    </>
  );
}
