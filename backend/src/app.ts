import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:19006","http://localhost:5173"] }));
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Şema
const ProfileSchema = z.object({
  gender: z.enum(["male","female"]),
  age: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive(),
  activity: z.enum(["sedentary","light","moderate","high","athlete"]),
});

// --- Tipleri çıkar ---
type Profile = z.infer<typeof ProfileSchema>;
type Activity = Profile["activity"];

// --- Haritayı union ile type et ---
const ACTIVITY_MULTIPLIER: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

app.post("/calc/tdee", (req, res) => {
  // İstersen safeParse kullan: hata yönetimi için daha iyi
  const parsed = ProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const p = parsed.data; // p: Profile

  const bmi = p.weightKg / Math.pow(p.heightCm / 100, 2);
  const bmr = p.gender === "male"
    ? 10*p.weightKg + 6.25*p.heightCm - 5*p.age + 5
    : 10*p.weightKg + 6.25*p.heightCm - 5*p.age - 161;

  const factor = ACTIVITY_MULTIPLIER[p.activity]; // ✔️ artık typed
  const tdee = Math.round(bmr * factor);

  res.json({ bmi: +bmi.toFixed(2), bmr: Math.round(bmr), tdee });
});

export default app;
