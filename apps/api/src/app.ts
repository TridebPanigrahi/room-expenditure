
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.WEB_URL,
  credentials: true
}));

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Room Expenditure API is running"
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;
