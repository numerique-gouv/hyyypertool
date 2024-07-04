//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import { get_organization_by_id } from "@~/organizations.repository/get_organization_by_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import organization_procedures_router from "./$procedures";
import type { ContextType } from "./context";
import organization_domains_router from "./domains";
import organization_members_router from "./members";
import { Organization_NotFound } from "./not-found";
import Organization_Page from "./page";

//

export default new Hono<ContextType>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function set_organization(
      { render, req, set, status, var: { moncomptepro_pg } },
      next,
    ) {
      const { id } = req.valid("param");
      const organization = await get_organization_by_id(moncomptepro_pg, {
        id,
      });

      if (!organization) {
        status(404);
        return render(
          <Organization_NotFound organization_id={Number(req.param("id"))} />,
        );
      }

      set("organization", organization);
      return next();
    },
    async function GET({ render }) {
      return render(<Organization_Page />);
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router)
  .route("/$procedures", organization_procedures_router);
