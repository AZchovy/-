import app from "./app";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Data Source initialization error:", err);
  });
