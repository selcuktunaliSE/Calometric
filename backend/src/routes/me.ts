import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";
import { bmiKgCm, bmrMifflinStJeor, tdeeFromBmr } from "../lib/calcs";

// Prisma Decimal, string vs. -> number
function toNum(x: unknown): number {
  if (typeof x === "number") return x;
  if (typeof x === "string") return Number(x);
  const anyX: any = x;
  if (anyX && typeof anyX.toNumber === "function") return anyX.toNumber();
  if (anyX && typeof anyX.valueOf === "function") return Number(anyX.valueOf());
  return Number(x as any);
}

const r = Router();

r.get("/profile", auth, async (req: any, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { profile: true, goals: true } // goals alanı tekil de olabilir; aşağıda ikisini de ele alıyoruz
  });

  const p = me?.profile;
  if (!p) return res.status(404).json({ error: "profile_not_found" });

  // Decimal -> number dönüşümleri
  const gender = p.gender as "male" | "female";
  const age = toNum(p.age);
  const heightCm = toNum(p.heightCm);
  const weightKg = toNum(p.weightKg);
  const activity = p.activity as "sedentary" | "light" | "moderate" | "high" | "athlete";

  const bmi = Number(bmiKgCm(weightKg, heightCm).toFixed(2));
  const bmr = Math.round(bmrMifflinStJeor(gender, age, heightCm, weightKg));
  const tdee = tdeeFromBmr(bmr, activity);

  // goals tekil mi çoğul mu? Her iki yapıyı da güvenli handle et:
  const g: any = (me as any).goals;
  const goal = Array.isArray(g) ? g[0] : g; // dizi ise ilkini al, tekil ise direkt al
  const goalKcal: number | null = goal?.dailyCalories ?? null;

  res.json({
    gender, age, heightCm, weightKg, activity,
    bmi, bmr, tdee, goalKcal
  });
});

export default r;
