//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout/index";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_moderations_route from "./moderations";
import user_organizations_page_route from "./organizations";
import User_Page, { UserPage_Provider } from "./page";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ req, render }) {
      const { id } = req.valid("param");

      return render(
        <UserPage_Provider value={{ id }}>
          <User_Page />
        </UserPage_Provider>,
      );
    },
  )
  .delete(
    "/",
    zValidator("param", Entity_Schema),
    async function DELETE({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      await moncomptepro_pg.delete(schema.users).where(eq(schema.users.id, id));
      return text("OK", 200, {
        "HX-Location": urls.users.$url().pathname,
      } as Htmx_Header);
    },
  )
  .patch(
    "/reset",
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      await moncomptepro_pg
        .update(schema.users)
        .set({
          email_verified: false,
        })
        .where(eq(schema.users.id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  //
  .route("/organizations", user_organizations_page_route)
  .route("/moderations", user_moderations_route);

//
