//

import { schema } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { ModerationTable, ModerationTable_Context } from "./ModerationTable";

//

const user_router = new Hono<moncomptepro_pg_Context>()
  .basePath("/:id")
  .get(
    "/moderations",
    zValidator("param", Entity_Schema),
    async ({ html, req, var: { moncomptepro_pg } }) => {
      const { id } = req.valid("param");

      const moderations = await moncomptepro_pg.query.moderations.findMany({
        orderBy: [
          asc(schema.moderations.moderated_at),
          desc(schema.moderations.created_at),
        ],
        where: eq(schema.moderations.user_id, id),
      });

      return html(
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

export const users_router = new Hono().route("", user_router);
