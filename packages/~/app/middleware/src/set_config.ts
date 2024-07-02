//

import type { App_Config } from "@~/app.core/config";
import dotenv from "dotenv";
import type { Env, MiddlewareHandler } from "hono";
import { env } from "node:process";

//

export function set_config(
  value?: Partial<App_Config>,
): MiddlewareHandler<ConfigVariables_Context> {
  if (value) {
    return async function set_config_middleware({ set }, next) {
      set("config", value as App_Config);
      await next();
    };
  }

  dotenv.config({
    override: true,
    path: [".env", ".env.local", `.env.${env.NODE_ENV}.local`],
  });

  return async function set_config_middleware({ set }, next) {
    const { app_env } = await import("@~/app.core/config/env");
    const app_config = app_env.parse(env, {
      path: ["env"],
    });
    const ASSETS_PATH = `/assets/${app_config.VERSION}` as const;
    const PUBLIC_ASSETS_PATH =
      `/assets/${app_config.VERSION}/public/built` as const;

    set("config", { ...app_config, ASSETS_PATH, PUBLIC_ASSETS_PATH });
    await next();
  };
}

//

export interface ConfigVariables_Context extends Env {
  Variables: {
    readonly config: App_Config;
  };
}
