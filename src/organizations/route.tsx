//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import { Entity_Schema, Pagination_Schema } from ":common/schema";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import organization_router from "./:id/route";
import Organizations_Page, {
  SEARCH_SIRET_INPUT_ID,
  Search_Schema,
} from "./page";

//

const page_router = new Hono<UserInfo_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.merge(Search_Schema).merge(Entity_Schema.partial()),
    ),
    function GET({ render, req, var: { nonce, userinfo } }) {
      const { page, [SEARCH_SIRET_INPUT_ID]: siret } = req.valid("query");

      const username = userinfo_to_username(userinfo);

      return render(
        <Organizations_Page
          pagination={{
            page: page,
            page_size: 10,
          }}
          search={{ [SEARCH_SIRET_INPUT_ID]: siret ?? "" }}
        />,
        {
          nonce,
          username,
        },
      );
    },
  );

//

export default new Hono()
  .route("", page_router)
  .route("/:id", organization_router);
