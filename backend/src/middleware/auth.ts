import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

export type AuthedRequest = Request & { userId?: string };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { uid: string };
    req.userId = payload.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
