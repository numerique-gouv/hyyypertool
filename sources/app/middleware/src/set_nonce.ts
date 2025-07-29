//

import type { Env, MiddlewareHandler } from "hono";

//

export function set_nonce(
  value?: string,
): MiddlewareHandler<NonceVariables_Context> {
  return async function set_nonce_middleware({ set }, next) {
    const nonce = value ?? crypto.getRandomValues(new Uint8Array(16)).join("");
    set("nonce", nonce);
    await next();
  };
}
//

export interface NonceVariables_Context extends Env {
  Variables: {
    readonly nonce: string;
  };
}
