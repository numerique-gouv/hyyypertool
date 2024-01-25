//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import { Entity_Schema, Pagination_Schema } from ":common/schema";
import UsersPage, { SEARCH_EMAIL_INPUT_ID } from ":legacy/users/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono<UserInfo_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
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

      return render(<UsersPage page={page} email={email} />, {
        nonce,
        username,
      });
    },
  );
