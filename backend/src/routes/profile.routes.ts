import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";
import { bmiKgCm, bmrMifflinStJeor, tdeeFromBmr } from "../lib/calcs";

const r = Router();

const SaveProfileSchema = z.object({
  gender: z.enum(["male","female"]),
  age: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive(),
  activity: z.enum(["sedentary","light","moderate","high","athlete"]),
  // opsiyonel hedefler
  goalDailyCalories: z.number().int().positive().optional(),
  proteinTargetG: z.number().int().positive().optional(),
  carbTargetG: z.number().int().positive().optional(),
  fatTargetG: z.number().int().positive().optional(),
});

r.post("/save", auth, async (req: any, res) => {
  const p = SaveProfileSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const { gender, age, heightCm, weightKg, activity,
          goalDailyCalories, proteinTargetG, carbTargetG, fatTargetG } = p.data;

  await prisma.profile.upsert({
    where: { userId: req.userId },
    update: { gender, age, heightCm, weightKg, activity },
    create: { userId: req.userId, gender, age, heightCm, weightKg, activity },
  });

  if (goalDailyCalories) {
    await prisma.goal.upsert({
      where: { userId: req.userId },
      update: { dailyCalories: goalDailyCalories, proteinTargetG, carbTargetG, fatTargetG },
      create: { userId: req.userId, dailyCalories: goalDailyCalories, proteinTargetG, carbTargetG, fatTargetG },
    });
  }

  const bmi = +bmiKgCm(weightKg, heightCm).toFixed(2);
  const bmr = Math.round(bmrMifflinStJeor(gender, age, heightCm, weightKg));
  const tdee = tdeeFromBmr(bmr, activity);

  res.json({ bmi, bmr, tdee });
});

r.get("/me", auth, async (req: any, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { profile: true, goals: true }
  });
  res.json(me);
});

export default r;
