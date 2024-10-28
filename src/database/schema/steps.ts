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

import { WFVersions } from "./wf-version.sql";
import { Workflows } from "./workflow.sql";

type NextStep = { next: "complete" | "error" } | { next: "step"; slug: string };
interface ValidateStep {
  response?: Record<string, unknown>;
}
export const Steps = pgTable(
  "steps",
  {
    id: serial().unique().primaryKey(),
    slug: varchar({ length: 150 }).notNull(),
    api: varchar({ length: 150 }).notNull(),
    workflow_id: integer()
      .references(() => Workflows.id)
      .notNull(),
    wf_version_id: integer()
      .references(() => WFVersions.id)
      .notNull(),
    validate: json().$type<ValidateStep>().default({}),
    on_success: json().$type<NextStep>().default({
      next: "complete",
    }),
    on_failure: json().$type<NextStep>().default({
      next: "error",
    }),
    created_at: timestamp({ mode: "string" }).default(sql`now()`),
    updated_at: timestamp({ mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    workflowIdVersionIdSlugUniqueIndex: unique(
      "workflowIdVersionIdSlugUniqueIndex",
    ).on(table.workflow_id, table.wf_version_id, table.slug),
  }),
);

export const WorkflowHasManySteps = relations(Workflows, ({ many }) => ({
  steps: many(Steps),
}));

export const VersionHasManySteps = relations(WFVersions, ({ many }) => ({
  steps: many(Steps),
}));

export const StepsBelongsToOneWorkflow = relations(Steps, ({ one }) => ({
  workflow: one(Workflows, {
    fields: [Steps.workflow_id],
    references: [Workflows.id],
  }),
}));

export const StepsBelongsToOneVersion = relations(Steps, ({ one }) => ({
  version: one(WFVersions, {
    fields: [Steps.wf_version_id],
    references: [WFVersions.id],
  }),
}));
