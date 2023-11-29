//

import { version } from ":package.json";
import { match } from "ts-pattern";
import { z } from "zod";

//

const GIT_SHA_SHEMA = z
  .string()
  .optional()
  .transform((sha) => (sha ? sha.slice(0, 7) : undefined));

const DEPLOY_ENV_SHEMA = z.enum(["preview", "preproduction", "production"]);

//

export default z
  .object({
    DATABASE_URL: z
      .string()
      .trim()
      .url()
      .default(
        "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
      ),
    DEPLOY_ENV: DEPLOY_ENV_SHEMA.default("preview"),
    ENTREPRISE_API_GOUV_TOKEN: z.string().trim(),
    GIT_SHA: GIT_SHA_SHEMA,
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    VERSION: z.string().default(
      match(
        DEPLOY_ENV_SHEMA.optional().parse(Bun.env.DEPLOY_ENV, {
          path: ["Bun.env.DEPLOY_ENV"],
        }),
      )
        .with(DEPLOY_ENV_SHEMA.Enum.production, () => version)
        .otherwise(
          () =>
            GIT_SHA_SHEMA.parse(Bun.env.GIT_SHA, {
              path: ["Bun.env.GIT_SHA"],
            }) ?? version,
        ),
    ),
  })
  .parse(Bun.env, {
    path: ["Bun.env"],
  });
