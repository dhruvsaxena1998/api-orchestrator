import { z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

export const insertProjectSchema = createInsertSchema(projects, {
  name: z.string().min(1),
  slug: z.string().min(1),
}).omit({
  id: true,
  created_at: true,
});

export type InsertProjectSchema = z.infer<typeof insertProjectSchema>;

export const selectProjectSchema = createSelectSchema(projects);
export type SelectProjectSchema = z.infer<typeof selectProjectSchema>;
