//

import { Pagination_Schema } from "@~/app.core/schema";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from "@~/app.layout/index";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { P, match } from "ts-pattern";
import moderation_router from "./:id/index";
import { Search_Schema } from "./context";
import { Moderations_Page } from "./page";

//
export default new Hono<UserInfo_Context & Csp_Context>()

  .route("/:id", moderation_router)
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get("/", function GET({ render, req, var: { nonce, userinfo } }) {
    const query = req.query();

    const search = match(Search_Schema.parse(query, { path: ["query"] }))
      .with(
        { search_email: P.not(P.union("", P.nullish)) },
        { search_siret: P.not(P.union("", P.nullish)) },
        (search) => ({
          ...search,
          hide_join_organization: false,
          hide_non_verified_domain: false,
          processed_requests: true,
        }),
      )
      .otherwise((search) => search);
    const pagination = Pagination_Schema.parse(query, { path: ["query"] });

    const username = userinfo_to_username(userinfo);
    return render(
      <Moderations_Page pagination={pagination} search={search} />,
      { nonce, username } as Main_Layout_Props,
    );
  });

//
