//

import { zValidator } from "@hono/zod-validator";
import {
  DescribedBy_Schema,
  Entity_Schema,
  Pagination_Schema,
} from "@~/app.core/schema";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { z } from "zod";
import organization_member_router from "./:user_id";
import { Table } from "./Table";
import type { ContextType } from "./context";

//

export default new Hono<ContextType>()
  //
  .route("/:user_id", organization_member_router)
  //

  .get(
    "/",
    jsxRenderer(),
    zValidator("param", Entity_Schema),
    zValidator(
      "query",
      Pagination_Schema.merge(DescribedBy_Schema).extend({
        page_ref: z.string(),
      }),
    ),

    function set_organization_id({ req, set }, next) {
      const { id: organization_id } = req.valid("param");
      set("organization_id", organization_id);
      return next();
    },
    function set_query_members_collection(
      { req, set, var: { moncomptepro_pg, organization_id } },
      next,
    ) {
      const query = req.query();
      const pagination = match(
        Pagination_Schema.safeParse(query, { path: ["query"] }),
      )
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => Pagination_Schema.parse({}));

      set("pagination", pagination);
      set(
        "query_members_collection",
        get_users_by_organization_id(moncomptepro_pg, {
          organization_id,
          pagination: { ...pagination, page: pagination.page - 1 },
        }),
      );
      return next();
    },

    async function GET({ render }) {
      return render(<Table />);
    },
  );
