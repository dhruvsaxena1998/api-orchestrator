import { z } from "@hono/zod-openapi";

import {
  insertProjectSchema,
  selectProjectSchema,
} from "@/database/schema/projects.sql";

export const createProjectSchema = insertProjectSchema.openapi({
  example: {
    name: "Test Project",
    slug: "test-project",
  },
});

export const createdProjectSchema = z.object({
  insertedId: z.number().openapi({ example: 1 }),
});

export const getProjectSchema = selectProjectSchema.openapi({
  example: {
    id: 1,
    name: "Test Project",
    slug: "test-project",
    created_at: "2024-10-24 21:31:04",
    updated_at: "2024-10-24 21:31:04",
  },
});

export const selectProjectBySlugSchema = z.object({
  slug: z.string().min(1).openapi({ example: "test-project" }),
});
