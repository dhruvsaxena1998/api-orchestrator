import { createRoute, z } from "@hono/zod-openapi";

import { ERROR_MESSAGES } from "@/config/constants";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "@/lib/constants/http-status-codes";
import {
  createErrorSchema,
  createSuccessSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/lib/utils/openapi/helpers";
import {
  createWorkflowSchema,
  getWorkflowSchema,
} from "@/routes/workflow/workflow.schema";

export const tags = ["workflows"];

export const CreateWorkflow = createRoute({
  path: "/workflows",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createWorkflowSchema, "Create Workflow"),
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(getWorkflowSchema),
      "Created Workflow",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(createWorkflowSchema),
      "Validation Error(s)",
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
      "Internal Server Error",
    ),
  },
});
export type CreateWorkflowRoute = typeof CreateWorkflow;
