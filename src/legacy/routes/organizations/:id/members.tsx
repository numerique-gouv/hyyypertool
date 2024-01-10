//

import { Id_Schema, Pagination_Schema } from ":common/schema";
import { z_coerce_boolean } from ":common/z.coerce.boolean";
import {
  moncomptepro_pg,
  schema,
  type User,
  type Users_Organizations,
} from ":database:moncomptepro";
import { type MCP_UserOrganizationLink } from ":moncomptepro";
import { api_ref } from ":paths";
import { CopyButton } from ":ui/button/copy";
import { row } from ":ui/table";
import { zValidator } from "@hono/zod-validator";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";
import { Hono } from "hono";
import { createContext, useContext } from "hono/jsx";
import { type VariantProps } from "tailwind-variants";
import { z } from "zod";

//

const Table_Context = createContext({
  page: 0,
  take: 5,
  count: 0,
});

type Verification_Type = MCP_UserOrganizationLink["verification_type"];

const Verification_Type_Schema = z.enum([
  "code_sent_to_official_contact_email",
  "in_liste_dirigeants_rna",
  "official_contact_domain",
  "official_contact_email",
  "verified_email_domain",
]);

//

const router = new Hono();
export default router;

//

router.get(
  "/",
  zValidator("param", Id_Schema),
  zValidator("query", Pagination_Schema),
  async function ({ html, req }) {
    const { id: organization_id } = req.valid("param");
    const { page } = req.valid("query");
    const take = 5;

    const where = and(
      eq(schema.users_organizations.organization_id, organization_id),
    );

    const { users, count } = await moncomptepro_pg.transaction(async () => {
      const users = await moncomptepro_pg
        .select()
        .from(schema.users)
        .innerJoin(
          schema.users_organizations,
          eq(schema.users.id, schema.users_organizations.user_id),
        )
        .where(where)
        .orderBy(desc(schema.users.created_at))
        .limit(take)
        .offset(page * take);
      const [{ value: count }] = await moncomptepro_pg
        .select({ value: drizzle_count() })
        .from(schema.users)
        .innerJoin(
          schema.users_organizations,
          eq(schema.users.id, schema.users_organizations.user_id),
        )
        .where(where);

      return { users, count };
    });

    const users_with_external = users.map((user) => ({
      ...user.users,
      is_external: user.users_organizations.is_external,
      verification_type: user.users_organizations.verification_type,
    }));

    return html(
      <Table_Context.Provider value={{ page, take, count }}>
        <Table organization_id={organization_id} users={users_with_external} />
      </Table_Context.Provider>,
    );
  },
);

router.patch(
  "/:user_id",
  zValidator(
    "param",
    Id_Schema.extend({
      user_id: z.string().pipe(z.coerce.number()),
    }),
  ),
  zValidator(
    "form",
    z.object({
      verification_type: Verification_Type_Schema.optional(),
      is_external: z.string().pipe(z_coerce_boolean).optional(),
    }),
  ),
  async function ({ text, req }) {
    const { id: organization_id, user_id } = req.valid("param");
    const { verification_type, is_external } = req.valid("form");

    await moncomptepro_pg
      .update(schema.users_organizations)
      .set({
        is_external,
        verification_type,
      })
      .where(
        and(
          eq(schema.users_organizations.organization_id, organization_id),
          eq(schema.users_organizations.user_id, user_id),
        ),
      );

    return text("OK", 200, {
      "HX-Trigger": "users_organizations_updated",
    });
  },
);

router.delete(
  "/:user_id",
  zValidator(
    "param",
    Id_Schema.extend({ user_id: z.string().pipe(z.coerce.number()) }),
  ),
  async function ({ text, req }) {
    const { id: organization_id, user_id } = req.valid("param");

    await moncomptepro_pg
      .delete(schema.users_organizations)
      .where(
        and(
          eq(schema.users_organizations.organization_id, organization_id),
          eq(schema.users_organizations.user_id, user_id),
        ),
      );

    return text("OK", 200, {
      "HX-Trigger": "users_organizations_updated",
    });
  },
);

//

type RowData = User &
  Pick<Users_Organizations, "is_external" | "verification_type">;

function Table({
  organization_id,
  users,
}: {
  organization_id: number;
  users: Array<RowData>;
}) {
  const { page, take, count } = useContext(Table_Context);

  return (
    <table class="!table">
      <thead>
        <tr>
          <th>Given Name</th>
          <th>Family Name</th>
          <th>Interne</th>
          <th>Email</th>
          <th>Job</th>
          <th>verification_type</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {users.map((user) => (
            <>
              <Row user={user} />
              <Actions user={user} organization_id={organization_id} />
            </>
          ))}
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th scope="row">Showing </th>
          <td colspan={2}>
            {page * take}-{page * take + take} of {count}
          </td>
          <td colspan={2} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={`/legacy/organizations/${organization_id}/members`}
              hx-trigger="input changed delay:500ms"
              hx-target="#table-organisation-members"
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {Math.floor(count / take)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function Row({
  user,
  variants,
}: {
  user: RowData;
  variants?: VariantProps<typeof row>;
}) {
  const verification_type = user.verification_type as Verification_Type;
  return (
    <tr
      _={`on click set the window's location to '${api_ref(
        "/legacy/users/:id",
        {
          id: String(user.id),
        },
      )}'`}
      class={row({ is_clickable: true, ...variants })}
    >
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.is_external ? "❌" : "✅"}</td>
      <td>{user.email}</td>
      <td>{user.job}</td>
      <td>{verification_type}</td>
    </tr>
  );
}

function Actions({
  user,
  organization_id,
}: {
  user: RowData;
  organization_id: number;
}) {
  const { email, id: user_id, is_external } = user;

  return (
    <tr>
      <td colspan={6}>
        <button
          class="fr-btn"
          hx-delete={`/legacy/organizations/${organization_id}/members/${user_id}`}
          hx-swap="none"
        >
          🚪🚶retirer de l'orga
        </button>
        <button
          class="fr-btn"
          hx-patch={`/legacy/organizations/${organization_id}/members/${user_id}`}
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.in_liste_dirigeants_rna,
          })}
        >
          🔄 vérif: liste dirigeants
        </button>
        <button
          class="fr-btn"
          hx-patch={`/legacy/organizations/${organization_id}/members/${user_id}`}
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.verified_email_domain,
          })}
        >
          🔄 vérif: domaine email
        </button>
        <button
          class="fr-btn"
          hx-patch={`/legacy/organizations/${organization_id}/members/${user_id}`}
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.official_contact_email,
          })}
        >
          🔄 vérif: mail officiel
        </button>
        <button
          class="fr-btn"
          hx-patch={`/legacy/organizations/${organization_id}/members/${user_id}`}
          hx-swap="none"
          hx-vals={JSON.stringify({
            is_external: !is_external,
          })}
        >
          🔄 interne/externe
        </button>
        <CopyButton text={email}>copier email</CopyButton>
      </td>
    </tr>
  );
}
