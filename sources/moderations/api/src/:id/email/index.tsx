//

import { zValidator } from "@hono/zod-validator";
import { DescribedBy_Schema, Entity_Schema } from "@~/app.core/schema";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { set_crisp_config } from "@~/crisp.middleware";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import Page from "./page";
import { loadEmailPageVariables, type ContextType } from "./page/context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  zValidator("query", DescribedBy_Schema),
  set_crisp_config(),
  async function set_variables_middleware(
    { req, set, var: { identite_pg, crisp_config } },
    next,
  ) {
    const { id } = req.valid("param");
    const variables = await loadEmailPageVariables(identite_pg, { id, crisp_config });
    set_variables(set, variables);
    return next();
  },
  async function GET({ render }) {
    return render(<Page />);
  },
);
