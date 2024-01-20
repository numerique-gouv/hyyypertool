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
    AGENTCONNECT_OIDC_CLIENT_ID: z.string().trim(),
    AGENTCONNECT_OIDC_ID_TOKEN_SIGNED_RESPONSE_ALG: z
      .string()
      .trim()
      .default("ES256"),
    AGENTCONNECT_OIDC_ISSUER: z.string().trim(),
    AGENTCONNECT_OIDC_SCOPE: z
      .string()
      .trim()
      .default(["openid", "given_name", "usual_name", "email"].join(" ")),
    AGENTCONNECT_OIDC_SECRET_ID: z.string().trim(),
    AGENTCONNECT_OIDC_USERINFO_SIGNED_RESPONSE_ALG: z
      .string()
      .trim()
      .default("ES256"),
    ALLOWED_USERS: z.string().trim().default(""),
    API_AUTH_PASSWORD: z.string().trim(),
    API_AUTH_URL: z.string().trim().url().default("localhost:3001"),
    API_AUTH_USERNAME: z.string().trim(),
    COOKIE_ENCRYPTION_KEY: z
      .string()
      .trim()
      .default("password_at_least_32_characters_long"),
    DATABASE_URL: z
      .string()
      .trim()
      .url()
      .default(
        "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
      ),
    DEPLOY_ENV: DEPLOY_ENV_SHEMA.default("preview"),
    DO_NOT_SEND_MAIL: z.coerce.boolean().default(false),
    ENTREPRISE_API_GOUV_TOKEN: z.string().trim(),
    GIT_SHA: GIT_SHA_SHEMA,
    HOST: z.string().trim().url().optional(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    SENTRY_DNS: z.string().trim().url().optional(),
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
    ZAMMAD_MODERATION_TAG: z.string().trim().default("moderation"),
    ZAMMAD_TOKEN: z.string().trim(),
    ZAMMAD_URL: z.string().trim().url(),
  })
  .parse(Bun.env, {
    path: ["Bun.env"],
  });
