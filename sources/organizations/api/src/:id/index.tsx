//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import { set_context_variables } from "@~/app.middleware/set_context_variables";
import { GetFicheOrganizationById } from "@~/organizations.lib/usecase";
import { GetOrganizationById } from "@~/organizations.repository";
import { get_domain_count } from "@~/organizations.repository/get_domain_count";
import { get_organization_members_count } from "@~/organizations.repository/get_organization_members_count";
import { to as await_to } from "await-to-js";
import { Hono } from "hono";
import { getContext } from "hono/context-storage";
import { jsxRenderer } from "hono/jsx-renderer";
import type { ContextType, ContextVariablesType } from "./context";
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
      { render, req, set, status, var: { identite_pg } },
      next,
    ) {
      const { id } = req.valid("param");
      const get_organization_by_id = GetOrganizationById({
        pg: identite_pg,
      });
      const [error, organization] = await await_to(
        get_organization_by_id(id, {
          columns: {
            cached_activite_principale: true,
            cached_adresse: true,
            cached_code_postal: true,
            cached_est_active: true,
            cached_etat_administratif: true,
            cached_libelle_categorie_juridique: true,
            cached_libelle_tranche_effectif: true,
            cached_libelle: true,
            cached_nom_complet: true,
            cached_tranche_effectifs: true,
            created_at: true,
            id: true,
            siret: true,
            updated_at: true,
          },
        }),
      );

      if (error instanceof NotFoundError) {
        status(404);
        return render(
          <Organization_NotFound organization_id={Number(req.param("id"))} />,
        );
      } else if (error) {
        throw error;
      }

      set("organization", organization);
      return next();
    },
    async function set_query_organization_members_count(
      { set, var: { organization, identite_pg } },
      next,
    ) {
      set(
        "query_organization_members_count",
        get_organization_members_count(identite_pg, {
          organization_id: organization.id,
        }),
      );
      return next();
    },
    async function set_context(ctx, next) {
      const {
        var: { identite_pg },
      } = getContext<ContextType>();
      const { id: organization_id } = ctx.req.valid("param");
      const get_fiche_organization_by_id = GetFicheOrganizationById({
        pg: identite_pg,
      });
      const organization_fiche =
        await get_fiche_organization_by_id(organization_id);
      const query_organization_domains_count = get_domain_count(identite_pg, {
        organization_id,
      });
      return set_context_variables<ContextVariablesType>(() => ({
        organization_fiche,
        organization: ctx.var.organization,
        query_organization_domains_count,
        query_organization_members_count:
          ctx.var.query_organization_members_count,
      }))(ctx as any, next);
    },
    async function GET({ render, set, var: { organization } }) {
      set("page_title", `Organisation ${organization.cached_libelle} (${organization.siret})`);
      return render(<Organization_Page />);
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router);
