import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";

const r = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

r.post("/register", async (req, res) => {
  const p = RegisterSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const exists = await prisma.user.findUnique({ where: { email: p.data.email } });
  if (exists) return res.status(409).json({ error: "email_in_use" });

  const passwordHash = await bcrypt.hash(p.data.password, 10);
  const user = await prisma.user.create({ data: { email: p.data.email, passwordHash } });
  res.json({ token: signToken(user.id) });
});

const LoginSchema = RegisterSchema;

r.post("/login", async (req, res) => {
  const p = LoginSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: p.data.email } });
  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(p.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  res.json({ token: signToken(user.id) });
});

export default r;
