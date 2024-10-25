import type { Logger as DrizzleLogger } from "drizzle-orm";
import type { Connection } from "mysql2/promise";

import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";

import ENV from "@/env";
import { logger } from "@/utils/logger";

import * as schema from "./schema";

let client: Connection;

class QueryLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.info(JSON.stringify({ query, params }));
  }
}

function getDrizzleInstance(client: Connection) {
  return drizzle<typeof schema, Connection>(client, {
    logger: new QueryLogger(),
    schema,
    mode: "default",
  });
}

export async function getConnection() {
  if (!client) {
    client = await createConnection({
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      user: ENV.DB_USER,
      password: ENV.DB_PASS,
      database: ENV.DB_NAME,
    });

    return getDrizzleInstance(client);
  }

  return getDrizzleInstance(client);
}
