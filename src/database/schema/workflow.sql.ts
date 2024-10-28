import { z } from "@hono/zod-openapi";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Projects } from "./projects.sql";

const MetadataSchema = z.object({
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  documentation: z.string().optional(),
});
export const Workflows = pgTable(
  "workflows",
  {
    id: serial().unique().primaryKey(),
    slug: varchar({ length: 150 }).notNull(),
    project_id: integer()
      .references(() => Projects.id)
      .notNull(),
    description: varchar({ length: 255 }).notNull(),
    metadata: json().$type<z.infer<typeof MetadataSchema>>().default({}),
    created_at: timestamp({ mode: "string" }).default(sql`now()`),
    updated_at: timestamp({ mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    projectSlugUniqueIndex: unique("projectVersionSlugUniqueIndex").on(
      table.project_id,
      table.slug,
    ),
  }),
);

export const insertWorkflowSchema = createInsertSchema(Workflows, {
  slug: z.string().min(1),
  metadata: MetadataSchema.optional(),
}).omit({
  id: true,
  created_at: true,
});
export type InsertWorkflowSchema = z.infer<typeof insertWorkflowSchema>;

export const selectWorkflowSchema = createSelectSchema(Workflows, {
  metadata: MetadataSchema.optional(),
});
export type SelectWorkflowSchema = z.infer<typeof selectWorkflowSchema>;

// Relations
export const ProjectHasManyWorkflows = relations(Projects, ({ many }) => ({
  workflows: many(Workflows),
}));

export const WorkflowBelongsToOneProject = relations(Workflows, ({ one }) => ({
  project: one(Projects, {
    fields: [Workflows.project_id],
    references: [Projects.id],
  }),
}));
