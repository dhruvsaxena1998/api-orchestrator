import type { AppRouteHandler } from "@/lib/@types/app";

import { INTERNAL_SERVER_ERROR, OK } from "@/lib/constants/http-status-codes";

import type {
  CreateProjectRoute,
  GetProjectBySlugRoute,
} from "./project.router";

import * as projectService from "./project.service";

export const CreateProjectHandler: AppRouteHandler<CreateProjectRoute> = async (
  ctx,
) => {
  const json = ctx.req.valid("json");

  const result = await projectService.createProject(json);
  if (result.isErr()) {
    return ctx.json(
      {
        success: false,
        error: {
          issues: [{ message: result.error }],
        },
      },
      INTERNAL_SERVER_ERROR,
    );
  }

  return ctx.json({ success: true, data: result.value }, OK);
};

export const GetProjectBySlugHandler: AppRouteHandler<
  GetProjectBySlugRoute
> = async (ctx) => {
  const { slug } = ctx.req.valid("param");

  const result = await projectService.getProjectBySlug(slug);
  if (result.isErr()) {
    return ctx.json(
      {
        success: false,
        error: {
          issues: [{ message: result.error.message }],
        },
      },
      result.error.code,
    );
  }

  return ctx.json({ success: true, data: result.value }, OK);
};
