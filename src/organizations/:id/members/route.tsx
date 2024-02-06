//

import { Entity_Schema, Pagination_Schema } from ":common/schema";
import { schema } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { zValidator } from "@hono/zod-validator";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";
import { Hono } from "hono";
import organization_member_router from "./:user_id/route";
import { Table, Table_Context } from "./Table";

//

export default new Hono<moncomptepro_pg_Context>()
  //
  .route("/:user_id", organization_member_router)
  //
  .get(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("query", Pagination_Schema),
    async function ({ html, req, var: { moncomptepro_pg } }) {
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
          <Table
            organization_id={organization_id}
            users={users_with_external}
          />
        </Table_Context.Provider>,
      );
    },
  );
