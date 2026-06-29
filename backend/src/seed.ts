import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const exists = await repo.findOneBy({ username });
  if (!exists) {
    const hash = await bcrypt.hash(password, 10);
    const u = repo.create({ username, email: "admin@example.com", password: hash, role: "admin" });
    await repo.save(u);
    console.log("Admin user created:", u.username);
  } else {
    console.log("Admin exists");
  }
  process.exit(0);
}
seed();
