"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface RegisterInput {
  name: string;
  email: string;
  password?: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return { success: true, user };
  } catch (err) {
    console.error("Register user error:", err);
    return { error: "Something went wrong on the server" };
  }
}
