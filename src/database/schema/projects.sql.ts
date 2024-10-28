import { z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { pgTable, serial, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Projects = pgTable(
  "projects",
  {
    id: serial("id").unique().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 150 }).notNull(),
    created_at: timestamp({ mode: "string" }).default(sql`now()`),
    updated_at: timestamp({ mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    slugUniqueIndex: unique("slug_unique_index").on(table.slug),
  }),
);

export const insertProjectSchema = createInsertSchema(Projects, {
  name: z.string().min(1),
  slug: z.string().min(1),
}).omit({
  id: true,
  created_at: true,
});

export type InsertProjectSchema = z.infer<typeof insertProjectSchema>;

export const selectProjectSchema = createSelectSchema(Projects);
export type SelectProjectSchema = z.infer<typeof selectProjectSchema>;
