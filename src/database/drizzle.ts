import type { Logger as DrizzleLogger } from "drizzle-orm/logger";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import ENV from "@/env";
import { logger } from "@/utils/logger";

import * as schema from "./schema";

const { Pool } = pg;

const pool = new Pool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  database: ENV.DB_NAME,
  ssl: ENV.NODE_ENV !== "dev",
});

class QueryLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.info(JSON.stringify({ query, params }));
  }
}

export const database = drizzle({
  client: pool,
  logger: new QueryLogger(),
  schema,
});
