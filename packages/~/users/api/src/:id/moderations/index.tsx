//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { get_moderations_by_user_id } from "@~/moderations.repository/get_moderations_by_user_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { ModerationTable, ModerationTable_Context } from "./ModerationTable";

//

export default new Hono<MonComptePro_Pg_Context>()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ render, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");

      const moderations = await get_moderations_by_user_id(moncomptepro_pg, {
        user_id: id,
      });

      return render(
        <ModerationTable_Context.Provider
          value={{
            page: 0,
            take: 10,
            count: 0,
            user_id: NaN,
          }}
        >
          <ModerationTable moderations={moderations}></ModerationTable>
        </ModerationTable_Context.Provider>,
      );
    },
  );
