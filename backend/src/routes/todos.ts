import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Todo } from "../entities/Todo";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { User } from "../entities/User";

const router = Router();

// Protected routes
router.use(authMiddleware);

// list with optional filters
router.get("/", async (req: AuthRequest, res) => {
  const repo = AppDataSource.getRepository(Todo);
  const { status, q, page = "1", per_page = "10", user_id } = req.query;
  const qb = repo.createQueryBuilder("todo").leftJoinAndSelect("todo.user", "user");

  if (status) qb.andWhere("todo.status = :status", { status });
  if (q) qb.andWhere("(todo.title LIKE :q OR todo.description LIKE :q)", { q: `%${q}%` });

  const currentUser = req.user as User;
  // normal users see only own todos unless admin and user_id provided
  if (currentUser.role !== "admin") {
    qb.andWhere("user.id = :uid", { uid: currentUser.id });
  } else if (user_id) {
    qb.andWhere("user.id = :uid", { uid: Number(user_id) });
  }

  qb.orderBy("todo.createdAt", "DESC");
  qb.skip((Number(page) - 1) * Number(per_page)).take(Number(per_page));
  const [items, total] = await qb.getManyAndCount();
  res.json({ items, total });
});

// create
router.post("/", async (req: AuthRequest, res) => {
  const repo = AppDataSource.getRepository(Todo);
  const userRepo = AppDataSource.getRepository(User);
  const { title, description, dueDate, priority } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const todo = repo.create({
    title,
    description,
    dueDate,
    priority: priority || "low",
    user: (await userRepo.findOneBy({ id: (req.user as User).id }))!,
  });
  await repo.save(todo);
  res.json(todo);
});

// get single
router.get("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(Todo);
  const todo = await repo.findOne({ where: { id }, relations: ["user"] });
  if (!todo) return res.status(404).json({ message: "Not found" });
  const currentUser = req.user as User;
  if (currentUser.role !== "admin" && todo.user.id !== currentUser.id)
    return res.status(403).json({ message: "Forbidden" });
  res.json(todo);
});

// update
router.put("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(Todo);
  const todo = await repo.findOne({ where: { id }, relations: ["user"] });
  if (!todo) return res.status(404).json({ message: "Not found" });
  const currentUser = req.user as User;
  if (currentUser.role !== "admin" && todo.user.id !== currentUser.id)
    return res.status(403).json({ message: "Forbidden" });
  repo.merge(todo, req.body);
  await repo.save(todo);
  res.json(todo);
});

// delete
router.delete("/:id", async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(Todo);
  const todo = await repo.findOne({ where: { id }, relations: ["user"] });
  if (!todo) return res.status(404).json({ message: "Not found" });
  const currentUser = req.user as User;
  if (currentUser.role !== "admin" && todo.user.id !== currentUser.id)
    return res.status(403).json({ message: "Forbidden" });
  await repo.remove(todo);
  res.json({ success: true });
});

export default router;
