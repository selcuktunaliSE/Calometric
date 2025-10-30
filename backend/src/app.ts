import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:19006","http://localhost:5173"] })); // RN Web/Expo ve frontend için
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// örnek BMI/TDEE hesap endpoint'i (sunucu tarafında)
const ProfileSchema = z.object({
  gender: z.enum(["male","female"]),
  age: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive(),
  activity: z.enum(["sedentary","light","moderate","high","athlete"])
});

app.post("/calc/tdee", (req, res) => {
  const p = ProfileSchema.parse(req.body);
  const bmi = p.weightKg / Math.pow(p.heightCm/100, 2);
  const bmr = p.gender === "male"
    ? 10*p.weightKg + 6.25*p.heightCm - 5*p.age + 5
    : 10*p.weightKg + 6.25*p.heightCm - 5*p.age - 161;
  const factor = {sedentary:1.2, light:1.375, moderate:1.55, high:1.725, athlete:1.9}[p.activity];
  const tdee = Math.round(bmr * factor);
  res.json({ bmi:+bmi.toFixed(2), bmr:Math.round(bmr), tdee });
});

export default app;
