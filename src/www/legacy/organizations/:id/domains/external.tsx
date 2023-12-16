import { prisma } from ":database";
import { Id_Schema } from ":schema";
import { button } from ":ui/button";
import { zValidator } from "@hono/zod-validator";
import type { organizations } from "@prisma/client";
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
    const organization_id = Number(id);
    if (isNaN(organization_id)) return notFound();

    const organization = await prisma.organizations.findUniqueOrThrow({
      where: { id: organization_id },
    });

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
    const organization_id = Number(id);
    if (isNaN(organization_id)) return notFound();

    await prisma.organizations.update({
      data: {
        external_authorized_email_domains: { push: domain },
      },
      where: { id: organization_id },
    });
    return text("", 200, {
      "HX-Trigger": "organisation_external_domain_updated",
    });
  },
);

router.delete(
  "/:domain",
  zValidator("param", Id_Schema.extend({ domain: z.string() })),
  async function ({ text, req, notFound }) {
    const { id, domain } = req.valid("param");
    const organization_id = Number(id);
    if (isNaN(organization_id)) return notFound();
    const organization = await prisma.organizations.findUniqueOrThrow({
      where: { id: organization_id },
    });
    await prisma.organizations.update({
      data: {
        external_authorized_email_domains:
          organization.external_authorized_email_domains.filter(
            (external_authorized_email_domain) =>
              external_authorized_email_domain !== domain,
          ),
      },
      where: { id: organization_id },
    });
    return text("", 200, {
      "HX-Trigger": "organisation_external_domain_updated",
    });
  },
);

//

export function Table({ organization }: { organization: organizations }) {
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
