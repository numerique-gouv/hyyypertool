//

import { zValidator } from "@hono/zod-validator";
import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Main_Layout } from "@~/app.layout";
import { hx_urls, urls } from "@~/app.urls";
import { get_unverified_domains } from "@~/organizations.repository/get_unverified_domains";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { query_schema, set_variables } from "./context";
import { Page } from "./Page";

//

const $describedby = hyper_ref();
const $table = hyper_ref();
const $search = hyper_ref();

export default new Hono().use("/", jsxRenderer(Main_Layout)).get(
  "/",
  zValidator("query", query_schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(urls.organizations.domains.$url().pathname);
  }),
  set_variables(async () => {
    const hx_domains_query_props = {
      ...(await hx_urls.organizations.domains.$get({ query: {} })),
      "hx-include": hx_include([
        $search,
        $table,
        query_schema.keyof().enum.page,
      ]),
      "hx-replace-url": true,
      "hx-select": `#${$table} > table`,
      "hx-target": `#${$table}`,
    };

    return {
      $describedby,
      $search,
      $table,
      hx_domains_query_props,
      query_unverified_domains: get_unverified_domains,
    };
  }),
  async function GET({ render }) {
    return render(<Page />);
  },
);
