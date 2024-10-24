import { z } from "zod";

const NextStepSchema = z.union([
  z.object({ next: z.literal("complete") }),
  z.object({ next: z.literal("error") }),
  z.object({ next: z.literal("step"), slug: z.string() }),
]);

const StepSchema = z.object({
  slug: z.string(),
  api: z.string(),
  validate: z
    .object({
      response: z.record(z.unknown()),
    })
    .optional(),
  on_success: NextStepSchema,
  on_failure: NextStepSchema,
});

const MetadataSchema = z
  .object({
    tags: z.array(z.string()).optional(),
    author: z
      .object({
        name: z.string(),
        email: z.string().email().optional(),
      })
      .optional(),
    documentation: z
      .object({
        href: z.string().url(),
      })
      .optional(),
  })
  .optional();

type Version = `v${number}`;
export const WorkflowSchema = z.object({
  slug: z.string(),
  description: z.string().optional(),
  version: z
    .string()
    .refine(
      (v): v is Version =>
        v.startsWith("v") && !Number.isNaN(Number(v.slice(1))),
    ),
  steps: z.array(StepSchema).min(1),
  metadata: MetadataSchema,
});

export type IWorkflow = z.infer<typeof WorkflowSchema>;
export type IStep = z.infer<typeof StepSchema>;
