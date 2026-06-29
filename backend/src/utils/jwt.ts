import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "change_this_secret";

export function sign(payload: object, expiresIn = "8h") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verify(token: string) {
  return jwt.verify(token, SECRET);
}
