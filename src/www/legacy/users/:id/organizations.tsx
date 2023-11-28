import { prisma } from ":database";
import { zValidator } from "@hono/zod-validator";
import type { organizations } from "@prisma/client";
import { Hono } from "hono";
import { Id_Schema } from "../..";

export default new Hono().get(
  "/",

  zValidator("param", Id_Schema),
  async function ({ html, req, notFound }) {
    const { id } = req.valid("param");

    const user_id = Number(id);
    if (isNaN(user_id)) return notFound();

    const organizations = await prisma.organizations.findMany({
      include: {},
      orderBy: { id: "asc" },
      where: { users_organizations: { some: { user_id } } },
    });
    // const {organizations} = await prisma.users_organizations.findMany({
    //   include: { organizations: true },
    //   orderBy: { user_id: "asc" },
    //   where: { user_id  },
    // });

    return html(
      <>
        <Table organizations={organizations} />
      </>,
    );
  },
);

const fields = [
  "siret",
  "cached_libelle",
  // "Interne",
  "verified_email_domains",
  "authorized_email_domains",
  "external_authorized_email_domains",
  "cached_code_officiel_geographique",
  // "authentication_by_peers_type",
  // "has_been_greeted",
  // "sponsor_id",
  // "needs_official_contact_email_verification",
  // "official_contact_email_verification_token",
  // "official_contact_email_verification_sent_at",
] as const;

export function Table({ organizations }: { organizations: organizations[] }) {
  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th safe>{name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          {organizations.map((organization) => (
            <tr>
              {fields.map((name) => (
                <td safe>{organization[name]}</td>
              ))}
            </tr>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
