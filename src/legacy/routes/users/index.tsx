//

import type { Csp_Context } from ":common/csp_headers";
import { Id_Schema, Pagination_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import UsersPage, { SEARCH_EMAIL_INPUT_ID } from ":legacy/users/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono<Session_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.extend({
        [SEARCH_EMAIL_INPUT_ID]: z.string().optional(),
      }).merge(Id_Schema.partial()),
    ),
    function ({ render, req, redirect, var: { nonce, session } }) {
      const userinfo = session.get("userinfo");
      const { page, [SEARCH_EMAIL_INPUT_ID]: email } = req.valid("query");

      if (!userinfo) {
        return redirect("/");
      }

      const username = userinfo_to_username(userinfo);

      return render(<UsersPage page={page} email={email} />, {
        nonce,
        username,
      });
    },
  );
