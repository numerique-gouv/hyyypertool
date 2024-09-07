//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import { GetOrganizationById } from "@~/organizations.repository";
import { to as await_to } from "await-to-js";
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
      const get_organization_by_id = GetOrganizationById({
        pg: moncomptepro_pg,
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
    async function GET({ render }) {
      return render(<Organization_Page />);
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router)
  .route("/$procedures", organization_procedures_router);
