//

import UsersPage, { SEARCH_EMAIL_INPUT_ID } from ":legacy/users/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono<UserInfo_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.extend({
        [SEARCH_EMAIL_INPUT_ID]: z.string().optional(),
      }).merge(Entity_Schema.partial()),
    ),
    function ({ render, req, var: { nonce, userinfo } }) {
      const { page, [SEARCH_EMAIL_INPUT_ID]: email } = req.valid("query");

      const username = userinfo_to_username(userinfo);

      return render(
        <UsersPage
          pagination={{
            page: page,
            page_size: 10,
          }}
          email={email}
        />,
        {
          nonce,
          username,
        },
      );
    },
  );
