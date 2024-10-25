import { desc, eq, sql } from "drizzle-orm";
import { err, ok } from "neverthrow";

import { ERROR_MESSAGES } from "@/config/constants";
import { getConnection } from "@/database/drizzle";
import {
  type InsertProjectSchema,
  projects,
} from "@/database/schema/projects.sql";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "@/lib/constants/http-status-codes";
import { logger } from "@/utils/logger";

export async function createProject(dto: InsertProjectSchema) {
  const connection = await getConnection();

  try {
    const [result] = await connection
      .insert(projects)
      .values(dto)
      .onDuplicateKeyUpdate({
        set: {
          updated_at: sql`NOW()`,
        },
      })
      .$returningId();

    return ok(result.id);
  } catch (error) {
    logger.error(error);
    return err(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getProjects() {
  const connection = await getConnection();

  try {
    const results = await connection
      .select()
      .from(projects)
      .orderBy(desc(projects.id));

    return ok(results);
  } catch (error) {
    logger.error(error);
    return err(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getProjectBySlug(slug: string) {
  const connection = await getConnection();

  try {
    const [result] = await connection
      .select()
      .from(projects)
      .where(eq(projects.slug, slug));

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
