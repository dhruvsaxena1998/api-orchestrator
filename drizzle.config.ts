import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "node:process";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema",
  dialect: "mysql",
  dbCredentials: {
    host: env.DB_HOST!,
    port: +env.DB_PORT!,
    user: env.DB_USER!,
    password: env.DB_PASS!,
    database: env.DB_NAME!,
  },
});
