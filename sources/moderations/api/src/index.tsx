//

import { Pagination_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout/index";
import { authorized } from "@~/app.middleware/authorized";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match, P } from "ts-pattern";
import moderation_router from "./:id/index";
import {
  loadModerationsListPageVariables,
  Search_Schema,
  type ContextType,
} from "./context";
import { Moderations_Page } from "./page";

//
export default new Hono<ContextType>()
  .use(authorized())

  .route("/:id", moderation_router)
  .get(
    "/",
    jsxRenderer(Main_Layout),
    async function set_variables_middleware({ req, set }, next) {
      const query = req.query();

      const search = match(Search_Schema.parse(query, { path: ["query"] }))
        .with(
          { search_email: P.not("") },
          { search_siret: P.not("") },
          (search) => ({
            ...search,
            hide_join_organization: false,
            hide_non_verified_domain: false,
            processed_requests: true,
          }),
        )
        .otherwise((search) => search);

      const pagination = match(
        Pagination_Schema.safeParse(query, { path: ["query"] }),
      )
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => Pagination_Schema.parse({}));

      const variables = await loadModerationsListPageVariables({
        pagination,
        search,
      });
      set_variables(set, variables);
      return next();
    },
    function GET({ render, set, var: { pagination, search } }) {
      set("page_title", "Liste des moderations");
      return render(
        <Moderations_Page pagination={pagination} search={search} />,
      );
    },
  );

//
