import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/jwt";

const r = Router();

const UpsertFoodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  brand: z.string().optional(),
  baseAmountG: z.number().int().positive().default(100),
  kcalPer100: z.number().int().nonnegative(),
  carbPer100: z.number().nonnegative(),
  proteinPer100: z.number().nonnegative(),
  fatPer100: z.number().nonnegative(),
});

r.post("/upsert", auth, async (req, res) => {
  const p = UpsertFoodSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const data = p.data;
  const food = data.id
    ? await prisma.food.update({ where: { id: data.id }, data })
    : await prisma.food.create({ data });
  res.json(food);
});

r.get("/search", auth, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const foods = await prisma.food.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 20,
  });
  res.json(foods);
});

export default r;
