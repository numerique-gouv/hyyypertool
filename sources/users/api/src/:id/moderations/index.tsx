//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { loadModerationsPageVariables, type ContextType } from "./context";
import { Table } from "./Table";

//

export default new Hono<ContextType>().use("/", jsxRenderer()).get(
  "/",
  zValidator("param", Entity_Schema),
  async function set_variables_middleware(
    { req, set, var: { identite_pg } },
    next,
  ) {
    const { id: user_id } = req.valid("param");
    const variables = await loadModerationsPageVariables(identite_pg, {
      user_id,
    });
    set_variables(set, variables);
    return next();
  },
  async function GET({ render }) {
    return render(<Table />);
  },
);
