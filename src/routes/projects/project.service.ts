import { desc, eq, sql } from "drizzle-orm";
import { err, ok } from "neverthrow";

import { ERROR_MESSAGES } from "@/config/constants";
import { database } from "@/database/drizzle";
import {
  type InsertProjectSchema,
  Projects,
} from "@/database/schema/projects.sql";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "@/lib/constants/http-status-codes";
import { logger } from "@/utils/logger";

export async function createProject(dto: InsertProjectSchema) {
  try {
    const [result] = await database
      .insert(Projects)
      .values(dto)
      .onConflictDoUpdate({
        target: Projects.slug,
        set: { updated_at: sql`now()` },
      })
      .returning();

    return ok(result);
  } catch (error) {
    logger.error(error);
    return err(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getProjects() {
  try {
    const results = await database
      .select()
      .from(Projects)
      .orderBy(desc(Projects.updated_at));

    return ok(results);
  } catch (error) {
    logger.error(error);
    return err(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const [result] = await database
      .select()
      .from(Projects)
      .where(eq(Projects.slug, slug));

    if (!result) {
      return err({ message: ERROR_MESSAGES.NOT_FOUND, code: NOT_FOUND });
    }

    return ok(result);
  } catch (error) {
    logger.error(error);
    return err({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      code: INTERNAL_SERVER_ERROR,
    });
  }
}
