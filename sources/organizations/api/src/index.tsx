//

import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout";
import { authorized } from "@~/app.middleware/authorized";
import { GetOrganizationsList } from "@~/organizations.repository/GetOrganizationsList";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import { PageQuery_Schema, type ContextType } from "./context";
import domains_router from "./domaines";
import leaders_router from "./leaders";
import Page from "./page";

//

export default new Hono<ContextType>()
  .use(authorized())
  //
  .route("/leaders", leaders_router)
  .route("/domains", domains_router)
  .route("/:id", user_page_route)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", PageQuery_Schema),
    async function set_query_organizations({ set, var: { identite_pg } }, next) {
      set("query_organizations", GetOrganizationsList(identite_pg));
      return next();
    },
    function GET({ render, set }) {
      set("page_title", "Liste des organisations");
      return render(<Page />);
    },
  );
