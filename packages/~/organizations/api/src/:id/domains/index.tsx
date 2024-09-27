//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema, Id_Schema } from "@~/app.core/schema";
import { EmailDomain_Type_Schema } from "@~/moncomptepro.lib/email_domain";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { add_authorized_domain } from "@~/organizations.repository/add_authorized_domain";
import { get_orginization_domains } from "@~/organizations.repository/get_orginization_domains";
import { update_domain_by_id } from "@~/organizations.repository/update_domain_by_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import type { ContextType } from "./context";
import { Table } from "./Table";

//

const DomainParams_Schema = z.object({ domain_id: Id_Schema });
const Query_Schema = z.object({ describedby: z.string() });

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(),
    zValidator("param", Entity_Schema),
    zValidator("query", Query_Schema),
    async function set_domains({ req, set, var: { moncomptepro_pg } }, next) {
      const { id: organization_id } = req.valid("param");
      const domains = await get_orginization_domains(
        { pg: moncomptepro_pg },
        {
          organization_id: organization_id,
        },
      );
      set("domains", domains);
      return next();
    },
    async function GET({ render }) {
      return render(<Table />);
    },
  )
  .put(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("form", z.object({ domain: z.string().min(1) })),
    async function PUT({ text, req, var: { moncomptepro_pg } }) {
      const { id: organization_id } = req.valid("param");
      const { domain } = req.valid("form");

      await add_authorized_domain(moncomptepro_pg, {
        organization_id,
        domain,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/:domain_id",
    zValidator("param", Entity_Schema.merge(DomainParams_Schema)),
    zValidator(
      "query",
      z.object({
        type: EmailDomain_Type_Schema.or(
          z.literal("null").transform(() => null),
        ),
      }),
    ),
    async function PATCH({ text, req, var: { moncomptepro_pg } }) {
      const { domain_id } = req.valid("param");
      const { type: verification_type } = req.valid("query");

      await update_domain_by_id(moncomptepro_pg, domain_id, {
        verification_type: verification_type,
        verified_at:
          verification_type === "verified"
            ? new Date().toISOString()
            : undefined,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  );
