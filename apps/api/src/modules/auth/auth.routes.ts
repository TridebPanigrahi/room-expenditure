import { Router } from "express";

import {
  register,
  login
} from "./auth.controller.js";

import { authenticate } from "../../middleware/authenticate.js";

import prisma from "../../config/database.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, async (req, res) => {

  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    success: true,
    data: user
  });
});

export default router;