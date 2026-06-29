import { Router } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { sign, verify } from "../utils/jwt";

const router = Router();
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: [{ username }, { email }] });
  if (existing) return res.status(400).json({ message: "User exists" });
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = repo.create({ username, email, password: hash });
  await repo.save(user);
  const token = sign({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) return res.status(400).json({ message: "Missing fields" });
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({
    where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = sign({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

router.get("/me", async (req: any, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(200).json(null);
  const token = auth.split(" ")[1];
  try {
    const payload = verify(token) as any;
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ id: payload.id });
    if (!user) return res.status(200).json(null);
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch {
    return res.status(200).json(null);
  }
});

export default router;
