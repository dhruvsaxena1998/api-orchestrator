import { relations, sql } from "drizzle-orm";
import {
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { projects } from "./projects.sql";

interface Metadata {
  tags?: string[];
  author?: string;
  documentation?: string;
}
export const workflows = mysqlTable(
  "workflows",
  {
    id: int("id", { unsigned: true }).primaryKey().autoincrement(),
    slug: varchar("slug", { length: 150 }).notNull(),
    version: varchar("version", { length: 5 }).notNull().default("v1"),
    project_id: int("project_id", { unsigned: true })
      .references(() => projects.id)
      .notNull(),
    description: text("description"),
    metadata: json("metadata").$type<Metadata>().default({}),
    created_at: timestamp("created_at", { mode: "string" })
      .notNull()
      .default(sql`now()`),
    updated_at: timestamp("updated_at", { mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => "NOW()"),
  },
  (table) => ({
    projectVersionSlugUniqueIndex: uniqueIndex(
      "projectVersionSlugUniqueIndex",
    ).on(table.project_id, table.version, table.slug),
  }),
);

export const ProjectHasManyWorkflows = relations(projects, ({ many }) => ({
  workflows: many(workflows),
}));

export const WorkflowBelongsToOneProject = relations(workflows, ({ one }) => ({
  project: one(projects, {
    fields: [workflows.project_id],
    references: [projects.id],
  }),
}));
