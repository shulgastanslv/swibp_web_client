"use server"

import { prisma } from "@/lib/prisma";

export async function CreateUser() {
  const result = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
    },
  });

  return result;
}
