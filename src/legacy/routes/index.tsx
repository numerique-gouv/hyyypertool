//

import type { Csp_Context } from ":common/csp_headers";
import { Id_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import { LegacyPage } from ":legacy/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<Session_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator("query", Id_Schema.partial().default({})),
    function ({ render, req, var: { nonce, session } }) {
      const { id } = req.valid("query");

      const username = userinfo_to_username(session.get("userinfo")!);
      return render(<LegacyPage active_id={id} />, { nonce, username });
    },
  );
