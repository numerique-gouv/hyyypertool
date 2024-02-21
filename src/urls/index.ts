//

import { hc } from "hono/client";
import type { Router } from "./pattern";

//

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
