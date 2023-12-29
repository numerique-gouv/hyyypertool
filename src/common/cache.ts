//

import { createMiddleware } from "hono/factory";
import env from "./env";

//

export const immutable = createMiddleware(async function immutable_middleware(
  { header },
  next,
) {
  await next();
  if (env.NODE_ENV === "development") return;
  header("cache-control", "public,max-age=31536000,immutable");
});
