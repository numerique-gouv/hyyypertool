//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import { Entity_Schema } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { Main_Layout } from "@~/app.layout/index";
import { set_context_variables } from "@~/app.middleware/set_context_variables";
import { GetFicheOrganizationById } from "@~/organizations.lib/usecase/GetFicheOrganizationById";
import { get_domain_count } from "@~/organizations.repository/get_domain_count";
import { get_organization_members_count } from "@~/organizations.repository/get_organization_members_count";
import { to } from "await-to-js";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import moderation_procedures_router from "./$procedures";
import {
  get_moderation,
  get_organization_member,
  type ContextType,
  type ContextVariablesType,
} from "./context";
import duplicate_warning_router from "./duplicate_warning";
import moderation_email_router from "./email/index";
import { Moderation_NotFound } from "./not-found";
import Page from "./page";

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", Entity_Schema),
    async function set_moderation(
      { render, req, set, status, var: { moncomptepro_pg } },
      next,
    ) {
      const { id: moderation_id } = req.valid("param");

      const [moderation_error, moderation] = await to(
        get_moderation({ pg: moncomptepro_pg }, { moderation_id }),
      );

      if (moderation_error instanceof NotFoundError) {
        status(404);
        return render(<Moderation_NotFound moderation_id={moderation_id} />);
      } else if (moderation_error) {
        throw moderation_error;
      }

      set("moderation", moderation);
      return next();
    },
    async function set_domain({ set, var: { moderation } }, next) {
      const domain = z_email_domain.parse(moderation.user.email, {
        path: ["moderation.users.email"],
      });
      set("domain", domain);
      return next();
    },
    async function set_organization_member(
      { set, var: { moderation, moncomptepro_pg } },
      next,
    ) {
      const organization_member = await get_organization_member(
        { pg: moncomptepro_pg },
        {
          organization_id: moderation.organization_id,
          user_id: moderation.user.id,
        },
      );
      set("organization_member", organization_member);
      return next();
    },
    async function set_query_domain_count(
      { set, var: { moderation, moncomptepro_pg } },
      next,
    ) {
      set(
        "query_domain_count",
        get_domain_count(moncomptepro_pg, {
          organization_id: moderation.organization_id,
        }),
      );
      return next();
    },
    async function set_query_organization_members_count(
      { set, var: { moderation, moncomptepro_pg } },
      next,
    ) {
      set(
        "query_organization_members_count",
        get_organization_members_count(moncomptepro_pg, {
          organization_id: moderation.organization_id,
        }),
      );
      return next();
    },
    async function set_context(ctx, next) {
      const {
        domain,
        moderation,
        organization_member,
        query_domain_count,
        query_organization_members_count,
      } = ctx.var;
      const get_fiche_organization_by_id = GetFicheOrganizationById({
        pg: ctx.var.moncomptepro_pg,
      });
      const organization_fiche = await get_fiche_organization_by_id(
        moderation.organization_id,
      );
      return set_context_variables<ContextVariablesType>(() => ({
        domain,
        moderation,
        organization_fiche,
        organization_member,
        query_domain_count,
        query_organization_members_count,
      }))(ctx as any, next);
    },
    function GET({ render }) {
      return render(<Page />);
    },
  )
  .route("/email", moderation_email_router)
  .route("/duplicate_warning", duplicate_warning_router)
  .route("/$procedures", moderation_procedures_router);
