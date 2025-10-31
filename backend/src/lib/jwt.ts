import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function signToken(userId: string) {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function auth(req: any, res: any, next: any) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ error: "unauthorized" });
  try {
    const token = hdr.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { uid: string };
    req.userId = payload.uid;
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}
