import type { AppRouteHandler } from "@/lib/@types/app";

import { INTERNAL_SERVER_ERROR, OK } from "@/lib/constants/http-status-codes";

import type { CreateWorkflowRoute, tags } from "./workflow.router";

import * as workflowService from "./workflow.service";

export const CreateWorkflowHandler: AppRouteHandler<
  CreateWorkflowRoute
> = async (ctx) => {
  const json = ctx.req.valid("json");

  const result = await workflowService.createWorkflow(json);
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
