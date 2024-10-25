import { createRouter } from "@/lib/utils/create-app";

import * as handlers from "./project.handler";
import * as routes from "./project.router";

const ProjectsRouter = createRouter()
  .openapi(routes.CreateProject, handlers.CreateProjectHandler)
  .openapi(routes.GetProjectBySlug, handlers.GetProjectBySlugHandler);

export default ProjectsRouter;
