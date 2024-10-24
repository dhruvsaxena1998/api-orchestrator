import { z } from "zod";

const keys = [
  "body",
  "query",
  "params",
  "headers",
  "response",
  "static",
] as const;

type IRequestKey = `${(typeof keys)[number]}.${string}`;

const RequestKeySchema = z.string().refine((v): v is IRequestKey => {
  const [base, ...rest] = v.split(".");
  return z.enum(keys).safeParse(base).success && rest.length === 0;
});

const ApiRequestSchema = z.object({
  query: z.record(RequestKeySchema).optional(),
  params: z.record(RequestKeySchema).optional(),
  headers: z.record(RequestKeySchema).optional(),
  body: z.record(RequestKeySchema).optional(),
  response: z.record(RequestKeySchema).optional(),
});

export const ApiSchema = z
  .object({
    slug: z.string(),
    endpoint: z.string(),
  })
  .and(
    z.union([
      z.object({
        method: z.literal("GET"),
        request: ApiRequestSchema.omit({ body: true }),
      }),
      z.object({
        method: z.enum(["POST", "PUT", "PATCH", "DELETE"]),
        request: ApiRequestSchema,
      }),
    ]),
  );

export type API = z.infer<typeof ApiSchema>;
export type APIRequest = z.infer<typeof ApiRequestSchema>;
