import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { Workflows } from "./workflow.sql";

export const WFVersions = pgTable(
  "wf_versions",
  {
    id: serial().unique().primaryKey(),
    workflow_id: integer()
      .references(() => Workflows.id)
      .notNull(),
    version: integer().notNull(),
    created_at: timestamp({ mode: "string" }).default(sql`now()`),
    updated_at: timestamp({ mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    workflowIdVersionUniqueIndex: unique("workflowIdVersionUniqueIndex").on(
      table.workflow_id,
      table.version,
    ),
  }),
);

export const WorkflowHasManyVersions = relations(Workflows, ({ many }) => ({
  versions: many(WFVersions),
}));

export const VersionBelongsToOneWorkflow = relations(WFVersions, ({ one }) => ({
  workflow: one(Workflows, {
    fields: [WFVersions.workflow_id],
    references: [Workflows.id],
  }),
}));
