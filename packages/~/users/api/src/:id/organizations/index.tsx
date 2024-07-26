//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import { get_organizations_by_user_id } from "@~/organizations.repository/get_organizations_by_user_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { EmptyTable, Table } from "./Table";
import type { ContextType } from "./context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  zValidator("query", Pagination_Schema),
  async function set_moderation({ req, set, var: { moncomptepro_pg } }, next) {
    const { id: user_id } = req.valid("param");
    const pagination = req.valid("query");

    const { count, organizations } = await get_organizations_by_user_id(
      moncomptepro_pg,
      {
        user_id,
        pagination: { ...pagination, page: pagination.page - 1 },
      },
    );

    set("count", count);
    set("organizations", organizations);
    return next();
  },
  async function GET({ render, var: { count } }) {
    return render(count === 0 ? <EmptyTable /> : <Table />);
  },
);
