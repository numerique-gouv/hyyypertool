//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { UserOrganizationTable, UserOrganizationTable_Provider } from "./Table";

//

export default new Hono()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("query", Pagination_Schema),
    async function GET({ render, req }) {
      const { id } = req.valid("param");
      const { page, page_size } = req.valid("query");

      return render(
        <UserOrganizationTable_Provider
          value={{ pagination: { page, page_size }, user_id: id }}
        >
          <UserOrganizationTable />
        </UserOrganizationTable_Provider>,
      );
    },
  );
