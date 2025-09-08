//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { GetModerationsByUserId } from "@~/moderations.repository/GetModerationsByUserId";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import type { ContextType } from "./context";
import { Table } from "./Table";

//

export default new Hono<ContextType>()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ render, req, set, var: { identite_pg } }) {
      const { id } = req.valid("param");
      const get_moderations_by_user_id = GetModerationsByUserId({
        pg: identite_pg,
      });
      const moderations = await get_moderations_by_user_id(id);
      set("moderations", moderations);

      //

      return render(<Table />);
    },
  );
