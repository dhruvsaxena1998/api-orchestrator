import { relations, sql } from "drizzle-orm";
import {
  int,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { workflows } from "./workflow.sql";

type NextStep = { next: "complete" | "error" } | { next: "step"; slug: string };
interface ValidateStep {
  response?: Record<string, unknown>;
}
export const steps = mysqlTable(
  "steps",
  {
    id: int("id", { unsigned: true }).primaryKey().autoincrement(),
    slug: varchar("slug", { length: 150 }).notNull(),
    api: varchar("api", { length: 150 }).notNull(),
    workflow_id: int("workflow_id", { unsigned: true }).references(
      () => workflows.id,
    ),
    validate: json("validate").$type<ValidateStep>().default({}),
    on_success: json("on_success").$type<NextStep>().default({
      next: "complete",
    }),
    on_failure: json("on_failure").$type<NextStep>().default({
      next: "error",
    }),
    created_at: timestamp("created_at", { mode: "string" })
      .notNull()
      .default(sql`now()`),
    updated_at: timestamp("updated_at", { mode: "string" })
      .default(sql`NOW()`)
      .$onUpdate(() => "NOW()"),
  },
  (table) => ({
    workflowIdSlugUniqueIndex: uniqueIndex("workflowIdSlugUniqueIndex").on(
      table.workflow_id,
      table.slug,
    ),
  }),
);

export const WorkflowHasManySteps = relations(workflows, ({ many }) => ({
  steps: many(steps),
}));

export const StepsBelongsToOneWorkflow = relations(steps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [steps.workflow_id],
    references: [workflows.id],
  }),
}));
