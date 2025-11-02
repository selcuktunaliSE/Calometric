import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";

const r = Router();

function dayBounds(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(d); start.setHours(0,0,0,0);
  const end = new Date(start); end.setDate(start.getDate()+1);
  return { start, end, dateKey: start.toISOString().slice(0,10) };
}

// GET /summary/today  ->  { date, totals: {kcal,carbG,proteinG,fatG}, targetKcal }
r.get("/today", auth, async (req:any, res) => {
  const { start, end, dateKey } = dayBounds(String(req.query.date || ""));
  const agg = await prisma.foodLog.aggregate({
    where: { userId: req.userId, date: { gte: start, lt: end } },
    _sum: { kcal:true, carbG:true, proteinG:true, fatG:true }
  });
  const goal = await prisma.goal.findUnique({ where: { userId: req.userId } });
  res.json({
    date: dateKey,
    totals: {
      kcal: agg._sum.kcal ?? 0,
      carbG: Number(agg._sum.carbG ?? 0),
      proteinG: Number(agg._sum.proteinG ?? 0),
      fatG: Number(agg._sum.fatG ?? 0),
    },
    targetKcal: goal?.dailyCalories ?? 0
  });
});

// GET /summary/week -> [ { date:'YYYY-MM-DD', kcal: number }, ... ]  (son 7 gün)
r.get("/week", auth, async (req:any, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today); start.setDate(today.getDate()-6);
  const logs = await prisma.foodLog.findMany({
    where: { userId: req.userId, date: { gte: start, lt: new Date(today.getTime()+86400000) } },
    select: { date:true, kcal:true },
    orderBy: { date: "asc" }
  });
  const byDay = new Map<string, number>();
  for (const x of logs) {
    const k = x.date.toISOString().slice(0,10);
    byDay.set(k, (byDay.get(k) ?? 0) + (x.kcal ?? 0));
  }
  const out = [];
  for (let i=6;i>=0;i--){
    const d = new Date(today); d.setDate(today.getDate()-i);
    const k = d.toISOString().slice(0,10);
    out.push({ date: k, kcal: byDay.get(k) ?? 0 });
  }
  res.json(out);
});

export default r;
