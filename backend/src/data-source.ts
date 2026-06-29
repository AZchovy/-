import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Todo } from "./entities/Todo";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.SQLITE_FILE || "db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Todo],
});
