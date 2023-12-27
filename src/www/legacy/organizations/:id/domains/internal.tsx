//

import type { Organization } from ":database:moncomptepro";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { Id_Schema } from ":schema";
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
      columns: {
        authorized_email_domains: true,
        id: true,
        verified_email_domains: true,
      },
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
        authorized_email_domains: sql`array_append(authorized_email_domains, ${domain})`,
      })
      .where(eq(schema.organizations.id, id));

    return text("", 200, {
      "HX-Trigger": "organisation_internal_domain_updated",
    });
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
        authorized_email_domains: sql`array_remove(authorized_email_domains, ${domain})`,
      })
      .where(eq(schema.organizations.id, id));

    return text("OK", 200, {
      "HX-Trigger": "organisation_internal_domain_updated",
    });
  },
);

router.patch(
  "/:domain",
  zValidator("param", Id_Schema.extend({ domain: z.string() })),
  zValidator(
    "form",
    z.object({
      // NOTE(douglasduteil): behold the false positive in z.coerce.boolean
      // \see https://github.com/colinhacks/zod/issues/1630
      is_verified: z
        .string()
        .pipe(z.enum(["true", "false"]).transform((v) => v === "true"))
        .optional(),
    }),
  ),
  async function ({ text, req, notFound }) {
    const { domain, id } = req.valid("param");
    const { is_verified } = req.valid("form");

    await moncomptepro_pg
      .update(schema.organizations)
      .set({
        verified_email_domains: is_verified
          ? sql`array_append(verified_email_domains, ${domain})`
          : sql`array_remove(verified_email_domains, ${domain})`,
      })
      .where(eq(schema.organizations.id, id));

    return text("OK", 200, {
      "HX-Trigger": "organisation_internal_domain_updated",
    });
  },
);

//

export function Table({
  organization,
}: {
  organization: Pick<
    Organization,
    "authorized_email_domains" | "id" | "verified_email_domains"
  >;
}) {
  const { authorized_email_domains, verified_email_domains } = organization;
  const domain_and_state = authorized_email_domains.map(
    (domain) => [domain, verified_email_domains.includes(domain)] as const,
  );
  return (
    <table class="!table">
      <thead>
        <tr>
          <th>Domain internes</th>
          <th>🔒</th>
        </tr>
      </thead>

      <tbody>
        {domain_and_state.map(([domain, is_verified]) => (
          <>
            <tr>
              <td safe>{domain}</td>
              <td safe>{is_verified ? "✅" : "❌"}</td>
            </tr>
            <tr>
              <td colspan={2}>
                <button
                  class={button()}
                  hx-delete={`/legacy/organizations/${organization.id}/domains/internal/${domain}`}
                  hx-swap="none"
                >
                  🗑️ Supprimer
                </button>
                <button
                  class={button()}
                  hx-patch={`/legacy/organizations/${organization.id}/domains/internal/${domain}`}
                  hx-vals={JSON.stringify({
                    is_verified: !is_verified,
                  })}
                  hx-swap="none"
                >
                  🔄 vérifié
                </button>
                <button
                  _="
                  on click
                    set text to @data-domain
                    js(me, text)
                      if ('clipboard' in window.navigator) {
                        navigator.clipboard.writeText(text)
                      }
                    end
                  "
                  class={button()}
                  data-domain={domain}
                >
                  📋 copier le domaine
                </button>
              </td>
            </tr>
          </>
        ))}
        <tr>
          <td colspan={2}>
            <form
              class="grid grid-cols-[1fr_min-content]"
              hx-put={`/legacy/organizations/${organization.id}/domains/internal`}
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
