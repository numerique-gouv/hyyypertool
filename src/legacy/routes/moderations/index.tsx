//

import { Id_Schema } from ":common/schema";
import {
  PageContext_01,
  SEARCH_EMAIL_INPUT_ID,
  SEARCH_SIRET_INPUT_ID,
  Table as Table_01,
} from ":legacy/01";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono().get(
  "/",
  zValidator(
    "query",
    z
      .object({
        page: z
          .string()
          .default("0")
          .pipe(z.coerce.number().int().nonnegative()),
        [SEARCH_EMAIL_INPUT_ID]: z.string().default(""),
        [SEARCH_SIRET_INPUT_ID]: z.string().default(""),
      })
      .merge(Id_Schema.partial()),
  ),
  async function ({ html, req }) {
    const {
      id,
      page,
      [SEARCH_EMAIL_INPUT_ID]: search_email,
      [SEARCH_SIRET_INPUT_ID]: search_siret,
    } = req.valid("query");

    return html(
      <>
        <PageContext_01.Provider
          value={{
            active_id: id ?? NaN,
            page,
            take: 5,
            search: {
              email: search_email,
              siret: search_siret,
            },
          }}
        >
          <Table_01 />
        </PageContext_01.Provider>
      </>,
    );
  },
);
