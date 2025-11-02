import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import foodRoutes from "./routes/food";
import logRoutes from "./routes/log";
import statsRoutes from "./routes/stats";
import summaryRoutes from "./routes/summary"
import meRoutes from "./routes/me"

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:19006"] }));
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/foods", foodRoutes);
app.use("/logs", logRoutes);
app.use("/stats", statsRoutes);
app.use("/summary", summaryRoutes);
app.use("/me", meRoutes);

export default app;
