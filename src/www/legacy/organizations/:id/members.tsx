import { prisma } from ":database";
import type { MCP_UserOrganizationLink } from ":moncomptepro";
import { zValidator } from "@hono/zod-validator";
import type { users } from "@prisma/client";
import { Hono } from "hono";
import { tv, type VariantProps } from "tailwind-variants";
import { Id_Schema } from "../..";

export default new Hono().get(
  "/",

  zValidator("param", Id_Schema),
  async function ({ html, req, notFound }) {
    const { id } = req.valid("param");
    const organization_id = Number(id);
    if (isNaN(organization_id)) return notFound();

    const users = await prisma.users.findMany({
      include: {},
      orderBy: { id: "asc" },
      where: { organization_members: { some: { organization_id } } },
    });

    return html(
      <>
        <Table users={users} />
      </>,
    );
  },
);
export function Table({ users }: { users: users[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Given Name</th>
          <th>Family Name</th>
          <th>Email</th>
          <th>Job</th>
          <th>verification_type</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {users.map((user) => (
            <Row user={user} />
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function Row({
  user,
  variants,
  verification_type,
}: {
  user: users;
  verification_type?: MCP_UserOrganizationLink["verification_type"];
  variants?: VariantProps<typeof row>;
}) {
  return (
    <tr class={row(variants)}>
      <td safe>{user.given_name}</td>
      <td safe>{user.family_name}</td>
      <td safe>{user.email}</td>
      <td safe>{user.job}</td>
      <td>{verification_type}</td>
    </tr>
  );
}
const row = tv({ variants: { is_active: { true: "bg-green-300" } } });
