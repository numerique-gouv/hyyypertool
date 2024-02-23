//

import { zValidator } from "@hono/zod-validator";
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
import moderation_router from "./:id/index";
import { Search_Schema } from "./context";
import { Moderations_Page } from "./page";

//
export default new Hono<UserInfo_Context & Csp_Context>()

  .route("/:id", moderation_router)
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("query", Search_Schema.merge(Pagination_Schema).partial()),
    function GET({ render, req, var: { nonce, userinfo } }) {
      let {
        hide_join_organization,
        hide_non_verified_domain,
        page,
        processed_requests,
        search_email,
        search_siret,
      } = req.valid("query");

      if (search_email || search_siret) {
        hide_join_organization = false;
        hide_non_verified_domain = false;
        processed_requests = true;
      }

      const username = userinfo_to_username(userinfo);
      return render(
        <Moderations_Page
          pagination={{
            page: page ?? 1,
            page_size: 10,
          }}
          search={{
            hide_join_organization: hide_join_organization ?? false,
            hide_non_verified_domain: hide_non_verified_domain ?? false,
            processed_requests: processed_requests ?? false,
            search_email: search_email ?? "",
            search_siret: search_siret ?? "",
          }}
        />,
        { nonce, username } as Main_Layout_Props,
      );
    },
  );

//
