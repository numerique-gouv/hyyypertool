//

import { Id_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import { LegacyPage } from ":legacy/page";
import { Main_Layout } from ":ui/layout/main";
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
      const { id } = req.valid("query");

      const session = get("session");
      const userinfo = session.get("userinfo");

      if (!userinfo) {
        return redirect("/");
      }

      const { usual_name, given_name } = userinfo;
      const username = `${given_name} ${usual_name}`;

      return render(<LegacyPage active_id={id} />, { username });
    },
  );
