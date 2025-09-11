//

import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Duplicate_Warning } from "./Duplicate_Warning";
import { loadDuplicateWarningPageVariables, ParamSchema, QuerySchema, type ContextType } from "./context";

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(),
    zValidator("param", ParamSchema),
    zValidator("query", QuerySchema),
    async function set_variables_middleware({ req, set, var: { identite_pg } }, next) {
      const { id: moderation_id } = req.valid("param");
      const { organization_id, user_id } = req.valid("query");
      const variables = await loadDuplicateWarningPageVariables(identite_pg, {
        moderation_id,
        organization_id,
        user_id,
      });
      set_variables(set, variables);
      return next();
    },
    async function GET({ render, var: variables }) {
      return render(
        <Duplicate_Warning.Context.Provider value={variables}>
          <Duplicate_Warning />
        </Duplicate_Warning.Context.Provider>,
      );
    },
  );
