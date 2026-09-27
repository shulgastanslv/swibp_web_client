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
      return { error: "Email и пароль обязательны для заполнения" };
    }

    if (password.length < 6) {
      return { error: "Пароль должен содержать минимум 6 символов" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: "Пользователь с таким email уже зарегистрирован" };
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
    return { error: "Произошла внутренняя ошибка сервера" };
  }
}
