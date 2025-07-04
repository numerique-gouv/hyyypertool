//

import { zValidator } from "@hono/zod-validator";
import { Pagination_Schema } from "@~/app.core/schema/index";
import { get_organizations_by_user_id } from "@~/organizations.repository/get_organizations_by_user_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { Table } from "./Table";
import { ParamSchema, QuerySchema, type ContextType } from "./context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function set_moderation({ req, set, var: { identite_pg } }, next) {
    const { id: user_id } = req.valid("param");
    const query = req.query();
    const pagination = match(
      Pagination_Schema.safeParse(query, { path: ["query"] }),
    )
      .with({ success: true }, ({ data }) => data)
      .otherwise(() => Pagination_Schema.parse({}));

    set("pagination", pagination);
    set(
      "query_organizations_collection",
      get_organizations_by_user_id(identite_pg, {
        user_id,
        pagination: { ...pagination, page: pagination.page - 1 },
      }),
    );
    return next();
  },
  async function GET({ render }) {
    return render(<Table />);
  },
);
