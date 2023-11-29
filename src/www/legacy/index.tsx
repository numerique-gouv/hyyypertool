//

import { Main_Layout } from ":layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { renderToReadableStream } from "hono/jsx/streaming";
import { tv } from "tailwind-variants";
import { z } from "zod";
import { PageContext_01, Table as Table_01, _01 } from "./01";
import { _02 } from "./02";
import { _03 } from "./03";
import { _04 } from "./04";

//

export const base = "/legacy";

const Query_SchemaValidator = zValidator(
  "query",
  z
    .object({
      page: z.string(),
      "search-email": z.string(),
      "search-siret": z.string(),
    })
    .partial()
    .default({}),
);

export const Id_Schema = z.object({
  id: z.string(),
});

const Id_SchemaValidator = zValidator(
  "query",
  z
    .object({
      id: z.string(),
    })
    .partial()
    .default({}),
);

export default new Hono()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .get(
    "/",
    zValidator(
      "query",
      z
        .object({
          id: z.string(),
        })
        .partial()
        .default({}),
    ),
    function ({ render, req }) {
      const { id } = req.valid("query");
      return render(
        <>
          <PageContext_01.Provider
            value={{
              active_id: Number(id ?? NaN),
              page: 0,
              take: 5,
              search: { email: "", siret: "" },
            }}
          >
            <_01 />
          </PageContext_01.Provider>
          <section id="moderation">
            {id ? (
              <>
                <_02 moderation_id={Number(id)} />
                <hr />
                <_03 moderation_id={Number(id)} />
                <hr />
                <_04 moderation_id={Number(id)} />
              </>
            ) : null}
          </section>
        </>,
      );
    },
  )
  .get(
    "/_/moderation/:id",
    zValidator("param", Id_Schema),
    async ({ body, req, notFound }) => {
      const { id } = req.valid("param");
      const moderation_id = Number(id);
      if (isNaN(moderation_id)) return notFound();

      return body(
        renderToReadableStream(
          <>
            <_02 moderation_id={moderation_id} />
            <_03 moderation_id={Number(id)} />
            <_04 moderation_id={Number(id)} />
          </>,
        ),
      );
    },
  )
  .route(
    "/_/01",
    new Hono().get(
      "/table",
      zValidator(
        "query",
        z
          .object({
            page: z.string(),
            "search-email": z.string(),
            "search-siret": z.string(),
          })
          .merge(Id_Schema)
          .partial()
          .default({}),
      ),
      async function ({ html, req }) {
        const {
          id,
          page,
          "search-email": search_email,
          "search-siret": search_siret,
        } = req.valid("query");

        return html(
          <>
            <PageContext_01.Provider
              value={{
                active_id: z.coerce
                  .number()
                  .int()
                  .nonnegative()
                  .or(z.nan())
                  .default(NaN)
                  .parse(id, { path: ["id"] }),
                page: z.coerce
                  .number()
                  .int()
                  .nonnegative()
                  .default(0)
                  .parse(page, { path: ["page"] }),
                take: 5,
                search: {
                  email: search_email ?? "",
                  siret: search_siret ?? "",
                },
              }}
            >
              <Table_01 />
            </PageContext_01.Provider>
          </>,
        );
      },
    ),
  );
const row = tv({ variants: { is_active: { true: "!bg-green-300" } } });
