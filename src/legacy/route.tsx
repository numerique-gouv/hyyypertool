//

import { hono_autoroute } from ":common/autorouter";
import type { Csp_Context } from ":common/csp_headers";
import env from ":common/env";
import { Pagination_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Moderations_Page, Search_Schema } from "./moderations/page";
import { moderations_router } from "./moderations/route";
import { organizations_router } from "./organizations/api/route";
import { users_router } from "./users/route";

//

const legacy_autoroute = await hono_autoroute({
  basePath: "/legacy",
  dir: "src/legacy/routes",
});

const legacy_page_route = new Hono<Session_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("query", Search_Schema.merge(Pagination_Schema).partial()),
    function GET({ redirect, render, req, var: { nonce, session } }) {
      const userinfo = session.get("userinfo");
      if (!userinfo) return redirect("/");
      const { page, search_email, search_siret, processed_requests } =
        req.valid("query");
      const username = userinfo_to_username(userinfo);
      return render(
        <Moderations_Page
          pagination={{
            page: page ?? 0,
            page_size: 10,
          }}
          search={{
            processed_requests: processed_requests ?? false,
            search_email: search_email ?? "",
            search_siret: search_siret ?? "",
          }}
        />,
        { nonce, username } as Main_Layout_Props,
      );
    },
  );

export const legacy_router = new Hono()
  .basePath("/legacy")
  .route("", legacy_page_route)
  .route("moderations", moderations_router)
  .route("organizations", organizations_router)
  .route("users", users_router);

//

export default new Hono<Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use(
    "/legacy/*",
    async function guard({ redirect, req, var: { sentry, session } }, next) {
      const userinfo = session.get("userinfo");

      if (!userinfo) {
        return redirect("/");
      }

      sentry.setUser({
        email: userinfo.email,
        id: userinfo.sub,
        username: userinfo.given_name,
        ip_address: req.header("x-forwarded-for"),
      });

      const is_allowed = env.ALLOWED_USERS.split(",").includes(userinfo.email);
      if (!is_allowed) {
        return redirect("/");
      }

      await next();

      sentry.setUser(null);
    },
  )
  .route("", legacy_autoroute)
  .route("", legacy_router);
