//

import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout";
import { get_organizations_list } from "@~/organizations.repository/get_organizations_list";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import { PageQuery_Schema, type ContextType } from "./context";
import domains_router from "./domaines";
import leaders_router from "./leaders";
import Page from "./page";

//

export default new Hono<ContextType>()
  .route("/leaders", leaders_router)
  .route("/domains", domains_router)
  .route("/:id", user_page_route)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", PageQuery_Schema),
    async function set_query_organizations({ set }, next) {
      set("query_organizations", get_organizations_list);
      return next();
    },
    function GET({ render }) {
      return render(<Page />);
    },
  );
