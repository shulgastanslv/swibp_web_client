"use server"

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/actions/auth-email";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

interface RegisterInput {
  name: string;
  email: string;
  password?: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  try {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized) || !password) {
      return { error: "Enter a valid email and a password" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: normalized,
        password: hashedPassword,
      },
    });

    const mailed = await sendVerificationEmail(normalized);
    if ("error" in mailed && mailed.error) {
      return {
        success: true as const,
        needsVerification: true as const,
        delivered: false,
        error: mailed.error,
      };
    }

    return {
      success: true as const,
      needsVerification: true as const,
      delivered: "delivered" in mailed ? mailed.delivered : false,
    };
  } catch (err) {
    console.error("Register user error:", err);
    return { error: "Something went wrong on the server" };
  }
}
