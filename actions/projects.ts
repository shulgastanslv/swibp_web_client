"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProjectListItem {
  id: string;
  title: string;
  aspectRatio: string;
  updatedAt: string;
  isSaved: boolean;
  slideCount: number;
}

// 1. Получение проектов конкретного пользователя
export async function getUserProjects(
  userId: string
): Promise<{ success: boolean; projects?: ProjectListItem[]; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: "userId не передан" };
    }

    const rawProjects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        savedBy: { where: { userId } },
        _count: { select: { slides: true } },
      },
    });

    const projects: ProjectListItem[] = rawProjects.map((p) => ({
      id: p.id,
      title: p.title,
      aspectRatio: p.aspectRatio,
      updatedAt: p.updatedAt.toISOString(),
      isSaved: p.savedBy.length > 0,
      slideCount: p._count.slides,
    }));

    return { success: true, projects };
  } catch (err) {
    console.error("getUserProjects error:", err);
    return { success: false, error: "Ошибка загрузки проектов" };
  }
}

// 2. Создание проекта для конкретного пользователя
export async function createProject(
  userId: string,
  title: string,
  aspectRatio = "1:1"
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: "userId не передан" };
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title: title.trim() || "Untitled Carousel",
        aspectRatio,
        slides: {
          create: {
            order: 0,
            canvasJSON: { version: "5.3.0", objects: [] },
          },
        },
      },
      select: { id: true },
    });

    revalidatePath("/");
    return { success: true, projectId: project.id };
  } catch (err) {
    console.error("createProject error:", err);
    return { success: false, error: "Не удалось создать проект" };
  }
}

// 3. Загрузка проекта по ID
export async function getProjectById(projectId: string) {
  try {
    if (!projectId) return { error: "projectId не передан" };

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        slides: { orderBy: { order: "asc" } },
      },
    });

    if (!project) return { error: "Проект не найден" };
    return { success: true, project };
  } catch (err) {
    console.error("getProjectById error:", err);
    return { error: "Ошибка загрузки" };
  }
}

// 4. Обновление названия
export async function updateProjectTitle(projectId: string, title: string) {
  try {
    if (!projectId) return { error: "projectId не передан" };

    await prisma.project.update({
      where: { id: projectId },
      data: { title },
    });
    return { success: true };
  } catch {
    return { error: "Не удалось обновить название" };
  }
}

// 5. Переключение избранного с передачей userId
export async function toggleSaveProject(
  userId: string,
  projectId: string
): Promise<{ success: boolean; saved?: boolean; error?: string }> {
  try {
    if (!userId || !projectId) {
      return { success: false, error: "userId или projectId не передан" };
    }

    const existing = await prisma.savedProject.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (existing) {
      await prisma.savedProject.delete({ where: { id: existing.id } });
      return { success: true, saved: false };
    } else {
      await prisma.savedProject.create({
        data: {
          userId,
          projectId,
        },
      });
      return { success: true, saved: true };
    }
  } catch (err) {
    console.error("toggleSaveProject error:", err);
    return { success: false, error: "Ошибка сохранения" };
  }
}

// 6. Удаление проекта
export async function deleteProject(projectId: string) {
  try {
    if (!projectId) return { error: "projectId не передан" };

    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Ошибка удаления проекта" };
  }
}
