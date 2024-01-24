//

import type { Csp_Context } from ":common/csp_headers";
import { Root_Provider } from ":common/root.provider";
import { Entity_Schema } from ":common/schema";
import { type Session_Context } from ":common/session";
import { MODERATION_PAGE_ID } from ":legacy/moderations/01";
import { LegacyPage } from ":legacy/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono<Session_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .get(
    "/",
    zValidator(
      "query",
      Entity_Schema.extend({
        [MODERATION_PAGE_ID]: z
          .string()
          .default("0")
          .pipe(z.coerce.number().int().nonnegative()),
      })
        .partial()
        .default({}),
    ),
    function ({ render, req, var: { nonce, session } }) {
      const { id, [MODERATION_PAGE_ID]: page } = req.valid("query");
      const userinfo = session.get("userinfo")!;
      const username = userinfo_to_username(userinfo);
      return render(
        <Root_Provider userinfo={userinfo}>
          <LegacyPage active_id={id} page={page} />
        </Root_Provider>,
        { nonce, username },
      );
    },
  );
