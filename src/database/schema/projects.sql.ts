import { sql } from "drizzle-orm";
import {
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const projects = mysqlTable("projects", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 150 }).unique().notNull(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  updated_at: timestamp("updated_at", { mode: "string" })
    .default(sql`NOW()`)
    .$onUpdate(() => "NOW()"),
});
