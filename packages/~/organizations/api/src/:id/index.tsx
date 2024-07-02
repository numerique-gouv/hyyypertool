//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import type { App_Context } from "@~/app.middleware/context";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import organization_procedures_router from "./$procedures";
import organization_domains_router from "./domains";
import organization_members_router from "./members";
import Organization_Page from "./page";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ req, render }) {
      const { id } = req.valid("param");
      return render(<Organization_Page id={id} />);
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router)
  .route("/$procedures", organization_procedures_router);
