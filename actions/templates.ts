"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import type { FabricCanvasJSON, RatioKey } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates/templates-data";
import {
  isRatioKey,
  parseTemplateCanvasJSON,
} from "@/lib/templates/parse";

export interface PublishTemplateInput {
  title: string;
  category: string;
  badge?: string;
  aspectRatio: RatioKey;
  canvasJSON: FabricCanvasJSON | { slides: FabricCanvasJSON[] };
  previewUrl?: string | null;
}

export interface TemplateListItem {
  id: string;
  title: string;
  category: string;
  badge: string | null;
  previewUrl: string | null;
  aspectRatio: string;
  slideCount: number;
  createdAt: string;
  builtin: boolean;
}

export interface TemplateDetail {
  id: string;
  title: string;
  category: string;
  badge: string | null;
  previewUrl: string | null;
  aspectRatio: RatioKey;
  slides: FabricCanvasJSON[];
  createdAt: string;
}

type ActionResult<T extends object = object> =
  | ({ success: true } & T)
  | { success: false; error: string };

function slideCountFromJSON(raw: unknown): number {
  return parseTemplateCanvasJSON(raw).slides.length;
}

export async function getTemplates(options?: {
  category?: string;
  search?: string;
}): Promise<ActionResult<{ templates: TemplateListItem[] }>> {
  try {
    const search = options?.search?.trim();
    const category = options?.category?.trim();

    const rows = await prisma.template.findMany({
      where: {
        AND: [
          category && category !== "all" ? { category } : {},
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { badge: { contains: search, mode: "insensitive" } },
                  { category: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        badge: true,
        previewUrl: true,
        aspectRatio: true,
        canvasJSON: true,
        createdAt: true,
      },
    });

    const templates: TemplateListItem[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      badge: row.badge,
      previewUrl: row.previewUrl,
      aspectRatio: row.aspectRatio,
      slideCount: slideCountFromJSON(row.canvasJSON),
      createdAt: row.createdAt.toISOString(),
      builtin: row.category === "Built-in",
    }));

    return { success: true, templates };
  } catch (err) {
    console.error("getTemplates error:", err);
    return { success: false, error: "Couldn't load templates" };
  }
}

export async function getTemplateById(
  templateId: string,
): Promise<ActionResult<{ template: TemplateDetail }>> {
  try {
    if (!templateId) return { success: false, error: "templateId is required" };

    const row = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!row) return { success: false, error: "Template not found" };

    const parsed = parseTemplateCanvasJSON(row.canvasJSON);
    const aspectRatio = isRatioKey(row.aspectRatio)
      ? row.aspectRatio
      : parsed.aspectRatio ?? "4:5";

    return {
      success: true,
      template: {
        id: row.id,
        title: row.title,
        category: row.category,
        badge: row.badge,
        previewUrl: row.previewUrl,
        aspectRatio,
        slides: parsed.slides,
        createdAt: row.createdAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("getTemplateById error:", err);
    return { success: false, error: "Couldn't load the template" };
  }
}

export async function publishTemplate(
  input: PublishTemplateInput,
): Promise<ActionResult<{ templateId: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Sign in to publish" };
    }

    const title = input.title.trim();
    const category = input.category.trim() || "Other";
    if (!title) return { success: false, error: "Enter a template name" };

    const template = await prisma.template.create({
      data: {
        title,
        category,
        badge: input.badge?.trim() || null,
        aspectRatio: input.aspectRatio,
        previewUrl: input.previewUrl ?? null,
        canvasJSON: {
          slides: Array.isArray((input.canvasJSON as { slides?: unknown }).slides)
            ? (input.canvasJSON as { slides: FabricCanvasJSON[] }).slides
            : [input.canvasJSON as FabricCanvasJSON],
          aspectRatio: input.aspectRatio,
        } as unknown as Prisma.InputJsonValue,
      },
      select: { id: true },
    });

    revalidatePath("/");
    return { success: true, templateId: template.id };
  } catch (err) {
    console.error("publishTemplate error:", err);
    return { success: false, error: "Couldn't publish the template" };
  }
}

/** Upserts local presets from `templates-data.ts` into the Template table. */
export async function seedBuiltinTemplates(): Promise<
  ActionResult<{ created: number; skipped: number }>
> {
  try {
    let created = 0;
    let skipped = 0;

    for (const preset of TEMPLATES) {
      const existing = await prisma.template.findFirst({
        where: {
          title: preset.name,
          category: "Built-in",
          badge: preset.badge,
        },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      let canvasJSON: unknown;
      try {
        canvasJSON = JSON.parse(preset.json);
      } catch {
        skipped += 1;
        continue;
      }

      const parsed = parseTemplateCanvasJSON(canvasJSON);

      await prisma.template.create({
        data: {
          title: preset.name,
          category: "Built-in",
          badge: preset.badge,
          aspectRatio: "1:1",
          canvasJSON: {
            slides: parsed.slides,
            aspectRatio: "1:1",
          } as unknown as Prisma.InputJsonValue,
        },
      });
      created += 1;
    }

    revalidatePath("/");
    return { success: true, created, skipped };
  } catch (err) {
    console.error("seedBuiltinTemplates error:", err);
    return { success: false, error: "Couldn't seed templates" };
  }
}

export async function getTemplateCategories(): Promise<
  ActionResult<{ categories: string[] }>
> {
  try {
    const rows = await prisma.template.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });
    return {
      success: true,
      categories: rows.map((r) => r.category),
    };
  } catch (err) {
    console.error("getTemplateCategories error:", err);
    return { success: false, error: "Couldn't load categories" };
  }
}
