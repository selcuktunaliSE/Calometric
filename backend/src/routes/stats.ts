import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";

const r = Router();

const RangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

r.get("/day", auth, async (req: any, res) => {
  const dateStr = String(req.query.date);
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const sum = await prisma.foodLog.aggregate({
    where: { userId: req.userId, date: { gte: start, lt: end } },
    _sum: { kcal: true, carbG: true, proteinG: true, fatG: true },
  });

  res.json(sum._sum);
});

// 🔹 GET /stats/range?start=2025-10-01T00:00:00.000Z&end=2025-10-08T00:00:00.000Z
r.get("/range", auth, async (req: any, res) => {
  const parsed = RangeSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { start, end } = parsed.data;

  const logs = await prisma.foodLog.findMany({
    where: { userId: req.userId, date: { gte: new Date(start), lt: new Date(end) } },
    select: { date: true, kcal: true, carbG: true, proteinG: true, fatG: true },
    orderBy: { date: "asc" },
  });

  const byDay = new Map<string, { kcal: number; carbG: number; proteinG: number; fatG: number }>();
  for (const x of logs) {
    const k = x.date.toISOString().slice(0, 10);
    const cur = byDay.get(k) ?? { kcal: 0, carbG: 0, proteinG: 0, fatG: 0 };
    byDay.set(k, {
      kcal: cur.kcal + x.kcal,
      carbG: +(cur.carbG + Number(x.carbG)).toFixed(2),
      proteinG: +(cur.proteinG + Number(x.proteinG)).toFixed(2),
      fatG: +(cur.fatG + Number(x.fatG)).toFixed(2),
    });
  }

  // Daha kolay tüketim için array döndür
  const out = Array.from(byDay.entries()).map(([date, values]) => ({
    date,
    ...values,
  }));

  res.json(out);
});

export default r;
