import prisma from "../../config/database.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import type {
  RegisterInput,
  LoginInput
} from "./auth.validation.js";

const accessSecret = process.env.JWT_ACCESS_SECRET;

if (!accessSecret) {
  throw new Error("JWT_ACCESS_SECRET is missing");
}

export const registerUser = async (data: RegisterInput) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase()
    }
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await argon2.hash(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {

  const user = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase()
    }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    data.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      sub: user.id
    },
    accessSecret,
    {
      expiresIn: "15m"
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    accessToken
  };
};