//

//
// This is a mock file. It is used to generate the type of the server route.
// It is not used in the application and must be replaces by the index.d.ts file.
//

import { type Csp_Context } from ":common/csp_headers";
import { Hono } from "hono";

//

declare const app: Hono<Csp_Context, {}, "/">;
export type Router = typeof app;
export default app;
