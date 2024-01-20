//

import { Entity_Schema } from ":common/schema";
import { z_coerce_boolean } from ":common/z.coerce.boolean";
import {
  PROCESSED_REQUESTS_INPUT_ID,
  PageContext_01,
  PageContext_01_default,
  SEARCH_EMAIL_INPUT_ID,
  SEARCH_SIRET_INPUT_ID,
  Table as Table_01,
} from ":legacy/moderations/01";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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
      .merge(Entity_Schema.partial()),
    (result, { html }) => {
      if (result.success) {
        return;
      }
      const { error } = result;
      const validationError = fromZodError(error);

      return html(
        <div class="fr-input-group fr-input-group--error">
          <div>
            <p class={"fr-error-text"}>{validationError.toString()}.</p>
          </div>
          <PageContext_01.Provider value={PageContext_01_default}>
            <Table_01 />
          </PageContext_01.Provider>
        </div>,
      );
    },
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
            ...PageContext_01_default,
            active_id: id ?? NaN,
            page,
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
