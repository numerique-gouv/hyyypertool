//

import type { Csp_Context } from ":common/csp_headers";
import { Root_Provider } from ":common/root.provider";
import { Entity_Schema } from ":common/schema";
import { type Session_Context } from ":common/session";
import { LegacyPage } from ":legacy/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<Session_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .get(
    "/",
    zValidator("query", Entity_Schema.partial().default({})),
    function ({ render, req, var: { nonce, session } }) {
      const { id } = req.valid("query");
      const userinfo = session.get("userinfo")!;
      const username = userinfo_to_username(userinfo);
      return render(
        <Root_Provider userinfo={userinfo}>
          <LegacyPage active_id={id} />
        </Root_Provider>,
        { nonce, username },
      );
    },
  );
