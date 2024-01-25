//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import { Entity_Schema, Pagination_Schema } from ":common/schema";
import { hyyyyyypertool_session } from ":common/session";
import OrganizationPage, {
  SEARCH_SIRET_INPUT_ID,
} from ":legacy/organizations/page";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono<UserInfo_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.extend({
        [SEARCH_SIRET_INPUT_ID]: z.string().optional(),
      }).merge(Entity_Schema.partial()),
    ),
    function ({ render, req, var: { nonce, userinfo } }) {
      const { page, [SEARCH_SIRET_INPUT_ID]: siret } = req.valid("query");

      const username = userinfo_to_username(userinfo);

      return render(<OrganizationPage page={page} siret={siret} />, {
        nonce,
        username,
      });
    },
  );
