import { z } from "@hono/zod-openapi";

import {
  insertWorkflowSchema,
  selectWorkflowSchema,
} from "@/database/schema/workflow.sql";

export const createWorkflowSchema = insertWorkflowSchema.openapi({
  example: {
    project_id: 1,
    slug: "test-workflow",
    description: "Test workflow",
  },
});

export const getWorkflowSchema = selectWorkflowSchema.openapi({
  example: {
    id: 1,
    project_id: 1,
    slug: "test-workflow",
    description: "Test workflow",
    metadata: {
      tags: ["test"],
      author: "Test Author",
      documentation: "https://test.com",
    },
    created_at: "2024-10-24 21:31:04",
    updated_at: "2024-10-24 21:31:04",
  },
});

export const selectWorkflowByProjectIdAndSlugSchema = z.object({
  project_id: z.number().min(1).openapi({ example: 1 }),
  slug: z.string().min(1).openapi({ example: "test-workflow" }),
});
