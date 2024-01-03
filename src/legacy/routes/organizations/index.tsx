//

import { Id_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import OrganizationPage from ":legacy/organizations/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<Session_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator("query", Id_Schema.partial().default({})),
    function ({ render, req, get, redirect }) {
      const session = get("session");
      const userinfo = session.get("userinfo");

      if (!userinfo) {
        return redirect("/");
      }

      const username = userinfo_to_username(userinfo);

      return render(<OrganizationPage />, { username });
    },
  );
