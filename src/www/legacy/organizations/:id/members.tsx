import { prisma } from ":database";
import type { MCP_UserOrganizationLink } from ":moncomptepro";
import { Id_Schema, Pagination_Schema } from ":schema";
import { zValidator } from "@hono/zod-validator";
import type { Prisma, users } from "@prisma/client";
import { Hono } from "hono";
import { createContext, useContext } from "hono/jsx";
import { tv, type VariantProps } from "tailwind-variants";
import { z } from "zod";

//

const Table_Context = createContext({
  page: 0,
  take: 5,
  count: 0,
});

//

const router = new Hono();
export default router;

//

router.get(
  "/",
  zValidator("param", Id_Schema),
  zValidator("query", Pagination_Schema),
  async function ({ html, req, notFound }) {
    const { id } = req.valid("param");
    const { page } = req.valid("query");
    const take = 5;
    const organization_id = Number(id);
    if (isNaN(organization_id)) return notFound();

    const where: Prisma.usersWhereInput = {
      organization_members: { some: { organization_id } },
    };

    const [users, count] = await prisma.$transaction([
      prisma.users.findMany({
        include: { organization_members: { select: { is_external: true } } },
        skip: page * take,
        take,
        orderBy: { id: "asc" },
        where,
      }),
      prisma.users.count({ where }),
    ]);
    const users_with_external = users.map((user) => ({
      ...user,
      is_external: Boolean(user.organization_members.at(0)?.is_external),
    }));
    return html(
      <Table_Context.Provider value={{ page, take, count }}>
        <Table organization_id={organization_id} users={users_with_external} />
      </Table_Context.Provider>,
    );
  },
);

router.patch(
  "/:user_id/verified",
  zValidator(
    "param",
    Id_Schema.extend({ user_id: z.string().pipe(z.coerce.number()) }),
  ),
  async function ({ text, req }) {
    const { id: organization_id, user_id } = req.valid("param");

    const { is_external } = await prisma.users_organizations.findUniqueOrThrow({
      where: { user_id_organization_id: { organization_id, user_id } },
    });
    await prisma.users_organizations.update({
      data: {
        is_external: !is_external,
      },
      where: { user_id_organization_id: { organization_id, user_id } },
    });
    return text("OK", 200, {
      "HX-Trigger": "users_organizations_updated",
    });
  },
);
//

function Table({
  organization_id,
  users,
}: {
  organization_id: number;
  users: Array<users & { is_external: boolean }>;
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
              <Actions email={user.email} />
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
  verification_type,
}: {
  user: users & { is_external: boolean };
  verification_type?: MCP_UserOrganizationLink["verification_type"];
  variants?: VariantProps<typeof row>;
}) {
  return (
    <tr class={row(variants)}>
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.is_external ? "❌" : "✅"}</td>
      <td>{user.email}</td>
      <td>{user.job}</td>
      <td>{verification_type}</td>
    </tr>
  );
}

function Actions({ email }: { email: string }) {
  return (
    <tr>
      <td colspan={6}>
        <button class="fr-btn">🚪🚶retirer de l'orga</button>
        <button class="fr-btn">🔄 vérif: liste dirigeants</button>
        <button class="fr-btn">🔄 vérif: domaine email</button>
        <button class="fr-btn">🔄 vérif: mail officiel</button>
        <button class="fr-btn">🔄 interne/externe</button>
        <button
          _="
         on click
           set text to @data-email
           js(me, text)
             if ('clipboard' in window.navigator) {
               navigator.clipboard.writeText(text)
             }
           end"
          class="fr-btn"
          data-email={email}
        >
          📋 copier email
        </button>
      </td>
    </tr>
  );
}

const row = tv({ variants: { is_active: { true: "bg-green-300" } } });
