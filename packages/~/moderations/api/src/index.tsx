//

import { Pagination_Schema } from "@~/app.core/schema";
import { asFunction, set_scope } from "@~/app.di";
import { Main_Layout } from "@~/app.layout/index";
import { authorized } from "@~/app.middleware/authorized";
import { get_moderations_list_handler } from "@~/moderations.repository/get_moderations_list";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { P, match } from "ts-pattern";
import moderation_router from "./:id/index";
import { z_query, type Commands, type ContextType } from "./context";
import { Moderations_Page } from "./page";

//

export default new Hono<ContextType>()
  .use(authorized())

  .route("/:id", moderation_router)
  .get(
    "/",
    jsxRenderer(Main_Layout),
    set_scope<Commands>((injector) => {
      injector.register({
        get_moderations_list: asFunction(get_moderations_list_handler),
      });
    }),

    function GET({ render, req, set, var: { injector } }) {
      const query = req.query();

      //

      const search = match(z_query.parse(query, { path: ["query"] }))
        .with({ email: P.not("") }, { siret: P.not("") }, (search) => ({
          ...search,
          hide_join_organization: false,
          hide_non_verified_domain: false,
          processed_requests: true,
        }))
        .otherwise((search) => search);
      set("search", search);

      //

      const pagination = match(
        Pagination_Schema.safeParse(query, { path: ["query"] }),
      )
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => Pagination_Schema.parse({}));
      set("pagination", pagination);

      //

      const { get_moderations_list } = injector.cradle;

      set(
        "query_moderations_list",
        get_moderations_list({
          search: {
            created_at: search.day,
            email: search.email,
            hide_join_organization: search.hide_join_organization,
            hide_non_verified_domain: search.hide_non_verified_domain,
            show_archived: search.processed_requests,
            siret: search.siret,
          },
          pagination: { ...pagination, page: pagination.page - 1 },
        }),
      );

      return render(<Moderations_Page />);
    },
  );

//
