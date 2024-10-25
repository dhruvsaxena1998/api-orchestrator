import { createRoute } from "@hono/zod-openapi";

import { ERROR_MESSAGES } from "@/config/constants";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
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
  createdProjectSchema,
  createProjectSchema,
  getProjectSchema,
  selectProjectBySlugSchema,
} from "@/routes/projects/project.schema";

export const tags = ["projects"];

export const CreateProject = createRoute({
  path: "/projects",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createProjectSchema, "Create Project"),
  },
  responses: {
    [OK]: jsonContent(
      createSuccessSchema(createdProjectSchema),
      "Created Project",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(createProjectSchema),
      "Validation Error(s)",
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
      "Internal Server Error",
    ),
  },
});
export type CreateProjectRoute = typeof CreateProject;

export const GetProjectBySlug = createRoute({
  path: "/projects/{slug}",
  method: "get",
  tags,
  request: {
    params: selectProjectBySlugSchema,
  },
  responses: {
    [OK]: jsonContent(createSuccessSchema(getProjectSchema), "Project Details"),
    [NOT_FOUND]: jsonContent(
      createErrorSchema(ERROR_MESSAGES.NOT_FOUND),
      "Not Found",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(selectProjectBySlugSchema),
      "Validation Error(s)",
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
      "Internal Server Error",
    ),
  },
});
export type GetProjectBySlugRoute = typeof GetProjectBySlug;
