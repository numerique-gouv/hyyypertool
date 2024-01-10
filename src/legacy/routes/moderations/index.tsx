//

import { Id_Schema } from ":common/schema";
import { z_coerce_boolean } from ":common/z.coerce.boolean";
import {
  PROCESSED_REQUESTS_INPUT_ID,
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
        [PROCESSED_REQUESTS_INPUT_ID]: z
          .string()
          .default("false")
          .pipe(z_coerce_boolean)

          .optional(),
        [SEARCH_EMAIL_INPUT_ID]: z.string().default(""),
        [SEARCH_SIRET_INPUT_ID]: z.string().default(""),
      })
      .merge(Id_Schema.partial()),
  ),
  async function ({ html, req }) {
    const {
      id,
      page,
      [PROCESSED_REQUESTS_INPUT_ID]: processed_requests,
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
              show_archived: Boolean(processed_requests),
            },
          }}
        >
          <Table_01 />
        </PageContext_01.Provider>
      </>,
    );
  },
);
