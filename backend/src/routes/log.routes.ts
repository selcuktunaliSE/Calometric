import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";

const r = Router();

const AddLogSchema = z.object({
  foodId: z.string(),
  date: z.string().datetime(),     // ISO, örn 2025-10-31T00:00:00.000Z (günü 00:00 yap)
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  amountG: z.number().int().positive(),
});

function calcMacros(amountG: number, kcalPer100: number, carbPer100: number, proteinPer100: number, fatPer100: number) {
  const ratio = amountG / 100;
  return {
    kcal: Math.round(kcalPer100 * ratio),
    carbG: +(carbPer100 * ratio).toFixed(2),
    proteinG: +(proteinPer100 * ratio).toFixed(2),
    fatG: +(fatPer100 * ratio).toFixed(2),
  };
}

r.post("/add", auth, async (req: any, res) => {
  const p = AddLogSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const food = await prisma.food.findUnique({ where: { id: p.data.foodId } });
  if (!food) return res.status(404).json({ error: "food_not_found" });

  const macros = calcMacros(p.data.amountG, food.kcalPer100, Number(food.carbPer100), Number(food.proteinPer100), Number(food.fatPer100));

  // logu yaz
  const log = await prisma.foodLog.create({
    data: {
      userId: req.userId,
      foodId: p.data.foodId,
      date: new Date(p.data.date),
      mealType: p.data.mealType,
      amountG: p.data.amountG,
      ...macros,
    },
  });

  // günlük toplam ve uyarı
  const start = new Date(p.data.date);
  const end = new Date(start); end.setDate(start.getDate() + 1);

  const dayTotals = await prisma.foodLog.aggregate({
    where: { userId: req.userId, date: { gte: start, lt: end } },
    _sum: { kcal: true, carbG: true, proteinG: true, fatG: true },
  });

  const goal = await prisma.goal.findUnique({ where: { userId: req.userId } });
  const exceeded = goal ? (dayTotals._sum.kcal ?? 0) > goal.dailyCalories : false;

  res.json({ log, dayTotals: dayTotals._sum, exceeded, limit: goal?.dailyCalories ?? null });
});

export default r;
