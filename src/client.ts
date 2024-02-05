//

import env from ":common/env";
import type { Router } from ":mapping";
import { $ } from "bun";
import { hc } from "hono/client";

//

if (env.NODE_ENV === "development") {
  console.log("> Rebuild route map");
  await $`tsc --project src/api/tsconfig.json`;
  console.log("< Rebuild route map");
}

export const app_hc = hc<Router>("http://localhost:3000", {
  fetch: (url: URL) => {
    // NOTE(douglasduteil): do not fetch
    // This is a hack to make the type system happy
    // One does not simply fetch the server while servering the response
    //
    // Should be use to link internal urls with
    // app_hc.api.posts.$url() // `/api/posts`
    //
    // see https://hono.dev/guides/rpc#url
    return url;
  },
} as any);
