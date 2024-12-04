//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout/index";
import { urls } from "@~/app.urls";
import { CrispApi } from "@~/crisp.lib/api";
import { set_crisp_config } from "@~/crisp.middleware";
import { schema } from "@~/moncomptepro.database";
import { ResetMFA } from "@~/users.lib/usecase";
import { get_user_by_id } from "@~/users.repository/get_user_by_id";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import type { ContextType } from "./context";
import user_moderations_route from "./moderations";
import { User_NotFound } from "./not-found";
import user_organizations_page_route from "./organizations";
import Page from "./page";

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", Entity_Schema),
    async function set_user(
      { render, req, set, status, var: { moncomptepro_pg } },
      next,
    ) {
      const { id } = req.valid("param");
      const user = await get_user_by_id(moncomptepro_pg, {
        id,
      });

      if (!user) {
        status(404);
        return render(<User_NotFound user_id={Number(req.param("id"))} />);
      }

      set("user", user);
      return next();
    },
    async function GET({ render }) {
      return render(<Page />);
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
    "/reset/email_verified",
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
  .patch(
    "/reset/password",
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      await moncomptepro_pg
        .update(schema.users)
        .set({
          encrypted_password: null,
        })
        .where(eq(schema.users.id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  .patch(
    "/reset/mfa",
    set_crisp_config(),
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({
      text,
      req,
      var: { crisp_config, moncomptepro_pg, userinfo },
    }) {
      const { id: user_id } = req.valid("param");

      const reset_mfa = ResetMFA({
        crisp: CrispApi(crisp_config),
        pg: moncomptepro_pg,
      });
      await reset_mfa({ moderator: userinfo, user_id });

      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  //
  .route("/organizations", user_organizations_page_route)
  .route("/moderations", user_moderations_route);

//
