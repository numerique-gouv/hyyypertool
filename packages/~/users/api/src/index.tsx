//

import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout/index";
import { urls } from "@~/app.urls";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_id_router from "./:id";
import { get_users_list, PageInput_Schema, type ContextType } from "./context";
import Page from "./page";

//

export default new Hono<ContextType>()
  .route("/:id", user_id_router)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    ({ set }, next) => {
      set("query_users", get_users_list);
      return next();
    },
    zValidator("query", PageInput_Schema, function hook(result, { redirect }) {
      if (result.success) return undefined;
      consola.error(result.error);
      return redirect(urls.users.$url().pathname);
    }),
    async function GET({ render }) {
      return render(<Page />);
    },
  );
