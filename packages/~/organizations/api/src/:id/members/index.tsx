//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { Hono } from "hono";
import organization_member_router from "./:user_id";
import { Table, Table_Context } from "./Table";

//

export default new Hono<MonComptePro_Pg_Context>()
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

      const { users, count } = await get_users_by_organization_id(
        moncomptepro_pg,
        {
          organization_id: organization_id,
          pagination: { page: page - 1, page_size: take },
        },
      );

      return html(
        <Table_Context.Provider value={{ page, take, count }}>
          <Table organization_id={organization_id} users={users} />
        </Table_Context.Provider>,
      );
    },
  );
