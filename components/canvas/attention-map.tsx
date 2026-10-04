"use client";

import { attentionZones, type InsightPlatform } from "@/lib/canvas/insights";
import type { RatioKey } from "@/lib/types";

export function AttentionMap({
  platform,
  ratio,
}: {
  platform: InsightPlatform;
  ratio: RatioKey;
}) {
  const zones = attentionZones(platform, ratio);

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="absolute rounded-full"
          style={{
            left: `${zone.x * 100}%`,
            top: `${zone.y * 100}%`,
            width: `${zone.r * 72}%`,
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(255, 92, 48, ${0.1 + zone.heat * 0.22}) 0%, rgba(255, 92, 48, 0) 70%)`,
          }}
        />
      ))}
    </div>
  );
}
