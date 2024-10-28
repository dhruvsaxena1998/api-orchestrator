import { createRouter } from "@/lib/utils/create-app";

import * as handlers from "./workflow.handler";
import * as routes from "./workflow.router";

const WorkflowRouter = createRouter().openapi(
  routes.CreateWorkflow,
  handlers.CreateWorkflowHandler,
);

export default WorkflowRouter;
