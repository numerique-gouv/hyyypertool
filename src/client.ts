//

import env from ":common/env";
import { hc } from "hono/client";
import type { Router } from "./bootstrap";

//

export const app_hc = hc<Router>(env.HOST ?? "http://localhost:3000", {
  fetch: (url: URL) => {
    console.log(url);
    return url;
  },
} as any);
