import { sql } from "drizzle-orm";
import { err, ok } from "neverthrow";

import { ERROR_MESSAGES } from "@/config/constants";
import { database } from "@/database/drizzle";
import {
  type InsertWorkflowSchema,
  Workflows,
} from "@/database/schema/workflow.sql";
import { logger } from "@/utils/logger";

export async function createWorkflow(dto: InsertWorkflowSchema) {
  try {
    const [result] = await database
      .insert(Workflows)
      .values(dto)
      .onConflictDoUpdate({
        target: [Workflows.project_id, Workflows.slug],
        set: { updated_at: sql`now()` },
      })
      .returning();

    return ok(result);
  } catch (error) {
    logger.error(error);
    return err(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
