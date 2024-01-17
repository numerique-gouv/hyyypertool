//

import type { Htmx_Header } from ":common/htmx";
import { Id_Schema } from ":common/schema";
import {
  moncomptepro_pg,
  schema,
  type Organization,
} from ":database:moncomptepro";
import { button } from ":ui/button";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const router = new Hono();
export default router;

//

router.get(
  "/",
  zValidator("param", Id_Schema),
  async function ({ html, req, notFound }) {
    const { id } = req.valid("param");

    const organization = await moncomptepro_pg.query.organizations.findFirst({
      where: eq(schema.organizations.id, id),
    });

    if (!organization) {
      return notFound();
    }

    return html(<Table organization={organization} />);
  },
);

router.put(
  "/",
  zValidator("param", Id_Schema),
  zValidator("form", z.object({ domain: z.string() })),
  async function ({ text, req, notFound }) {
    const { id } = req.valid("param");
    const { domain } = req.valid("form");

    await moncomptepro_pg
      .update(schema.organizations)
      .set({
        external_authorized_email_domains: sql`array_append(external_authorized_email_domains, ${domain})`,
      })
      .where(eq(schema.organizations.id, id));

    return text("", 200, {
      "HX-Trigger": "organisation_external_domain_updated",
    } as Htmx_Header);
  },
);

router.delete(
  "/:domain",
  zValidator("param", Id_Schema.extend({ domain: z.string() })),
  async function ({ text, req, notFound }) {
    const { id, domain } = req.valid("param");

    await moncomptepro_pg
      .update(schema.organizations)
      .set({
        external_authorized_email_domains: sql`array_remove(external_authorized_email_domains, ${domain})`,
      })
      .where(eq(schema.organizations.id, id));

    return text("", 200, {
      "HX-Trigger": "organisation_external_domain_updated",
    } as Htmx_Header);
  },
);

//

export function Table({ organization }: { organization: Organization }) {
  const { external_authorized_email_domains } = organization;

  return (
    <table class="!table">
      <thead>
        <tr>
          <th>Domain externe</th>
        </tr>
      </thead>

      <tbody>
        {external_authorized_email_domains.map((domain) => (
          <>
            <tr>
              <td>{domain}</td>
            </tr>
            <tr>
              <td colspan={2}>
                <button
                  class={button()}
                  hx-delete={`/legacy/organizations/${organization.id}/domains/external/${domain}`}
                  hx-swap="none"
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          </>
        ))}
        <tr>
          <td colspan={2}>
            <form
              class="grid grid-cols-[1fr_min-content]"
              hx-put={`/legacy/organizations/${organization.id}/domains/external`}
            >
              <input class="fr-input" type="text" name="domain" />
              <button class="fr-btn" type="submit">
                Add
              </button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
