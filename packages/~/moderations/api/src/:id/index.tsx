//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import { Entity_Schema } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { Main_Layout } from "@~/app.layout/index";
import type { App_Context } from "@~/app.middleware/context";
import { set_context_variables } from "@~/app.middleware/set_context_variables";
import { GetFicheOrganizationById } from "@~/organizations.lib/usecase";
import { get_domain_count } from "@~/organizations.repository/get_domain_count";
import { get_organization_members_count } from "@~/organizations.repository/get_organization_members_count";
import { to } from "await-to-js";
import { Hono } from "hono";
import { getContext } from "hono/context-storage";
import { jsxRenderer } from "hono/jsx-renderer";
import moderation_procedures_router from "./$procedures";
import {
  get_moderation,
  get_organization_member,
  type ContextType,
  type ContextVariablesType,
  type ModerationContext,
} from "./context";
import duplicate_warning_router from "./duplicate_warning";
import moderation_email_router from "./email/index";
import { Moderation_NotFound } from "./not-found";
import Page from "./page";

//

export default new Hono<ModerationContext>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", Entity_Schema),
    async function set_moderation({ render, req, set, status }, next) {
      const { moncomptepro_pg } = getContext<App_Context>().var;
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
    set_context_variables<ContextVariablesType>(async () => {
      const { moderation, moncomptepro_pg } = getContext<ContextType>().var;

      //

      const domain = z_email_domain.parse(moderation.user.email, {
        path: ["moderation.users.email"],
      });

      //

      const organization_member = await get_organization_member(
        { pg: moncomptepro_pg },
        {
          organization_id: moderation.organization_id,
          user_id: moderation.user.id,
        },
      );

      //

      const get_fiche_organization_by_id = GetFicheOrganizationById({
        pg: moncomptepro_pg,
      });
      const organization_fiche = await get_fiche_organization_by_id(
        moderation.organization_id,
      );

      //

      return {
        domain,
        moderation,
        organization_fiche,
        organization_member,
        query_domain_count: get_domain_count(moncomptepro_pg, {
          organization_id: moderation.organization_id,
        }),
        query_organization_members_count: get_organization_members_count(
          moncomptepro_pg,
          {
            organization_id: moderation.organization_id,
          },
        ),
      };
    }),
    function GET({ render }) {
      return render(<Page />);
    },
  )
  .route("/email", moderation_email_router)
  .route("/duplicate_warning", duplicate_warning_router)
  .route("/$procedures", moderation_procedures_router);
