//

import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Table } from "./Table";
import { loadOrganizationsPageVariables, ParamSchema, QuerySchema, type ContextType } from "./context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function set_variables_middleware({ req, set, var: { identite_pg } }, next) {
    const { id: user_id } = req.valid("param");
    const query = req.query();
    const variables = await loadOrganizationsPageVariables(identite_pg, { user_id, query });
    set_variables(set, variables);
    return next();
  },
  async function GET({ render }) {
    return render(<Table />);
  },
);
