//

import { hc } from "hono/client";
import type { Router } from "./pattern";

//

export { hx_urls } from "./hx_urls";

//
export const urls = hc<Router>("http://localhost:3000", {
  fetch: (url: string) => {
    // NOTE(douglasduteil): do not fetch
    // This is a hack to make the type system happy
    // One does not simply fetch the server while servering the response
    //
    // Should be use to link internal urls with
    // urls.api.posts.$url() // `/api/posts`
    //
    // see https://hono.dev/guides/rpc#url
    return Promise.resolve(new Response(url));
  },
});
