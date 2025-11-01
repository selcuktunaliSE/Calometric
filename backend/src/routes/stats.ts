import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";

const r = Router();

const RangeSchema = z.object({
  start: z.string().datetime(), // günün 00:00'ı
  end: z.string().datetime(),   // ertesi gün 00:00 (exclusive) ya da ileri tarih
});

r.get("/day", auth, async (req: any, res) => {
  const dateStr = String(req.query.date); // tek gün
  const start = new Date(dateStr);
  const end = new Date(start); end.setDate(start.getDate() + 1);

  const sum = await prisma.foodLog.aggregate({
    where: { userId: req.userId, date: { gte: start, lt: end } },
    _sum: { kcal: true, carbG: true, proteinG: true, fatG: true },
  });
  res.json(sum._sum);
});

r.get("/range", auth, async (req: any, res) => {
  const p = RangeSchema.safeParse({ start: req.query.start, end: req.query.end });
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const logs = await prisma.foodLog.findMany({
    where: { userId: req.userId, date: { gte: new Date(p.data.start), lt: new Date(p.data.end) } },
    select: { date: true, kcal: true, carbG: true, proteinG: true, fatG: true },
    orderBy: { date: "asc" },
  });

  // Gün bazında grupla (JS tarafında)
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const byDay = new Map<string, { kcal: number, carbG: number, proteinG: number, fatG: number }>();

  for (const x of logs) {
    const k = dayKey(x.date);
    const cur = byDay.get(k) ?? { kcal: 0, carbG: 0, proteinG: 0, fatG: 0 };
    byDay.set(k, {
      kcal: cur.kcal + x.kcal,
      carbG: +(cur.carbG + Number(x.carbG)).toFixed(2),
      proteinG: +(cur.proteinG + Number(x.proteinG)).toFixed(2),
      fatG: +(cur.fatG + Number(x.fatG)).toFixed(2),
    });
  }

  res.json(Object.fromEntries(byDay));
});

export default r;
