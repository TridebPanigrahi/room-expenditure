import type {
  Request,
  Response
} from "express";

import {
  registerUser,
  loginUser
} from "./auth.service.js";

import {
  registerSchema,
  loginSchema
} from "./auth.validation.js";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details",
        errors: validation.error.issues
      });
    }

    const user = await registerUser(validation.data);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user
    });

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Registration failed";

    return res.status(
      message === "Email already registered" ? 409 : 500
    ).json({
      success: false,
      message
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details"
      });
    }

    const result = await loginUser(validation.data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Login failed";

    return res.status(
      message === "Invalid email or password" ? 401 : 500
    ).json({
      success: false,
      message
    });
  }
};