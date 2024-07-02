//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout/index";
import type { App_Context } from "@~/app.middleware/context";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import user_id_router from "./:id";
import UsersPage, { SEARCH_EMAIL_INPUT_ID } from "./page";

//

export default new Hono<App_Context>()
  .route("/:id", user_id_router)
  //
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.extend({
        [SEARCH_EMAIL_INPUT_ID]: z.string().optional(),
      }).merge(Entity_Schema.partial()),
    ),
    function ({ render, req }) {
      const { page, [SEARCH_EMAIL_INPUT_ID]: email } = req.valid("query");

      return render(
        <UsersPage
          pagination={{
            page: page,
            page_size: 10,
          }}
          email={email}
        />,
      );
    },
  );
