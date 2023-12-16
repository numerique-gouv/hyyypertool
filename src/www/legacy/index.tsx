//

import { Main_Layout } from ":layout/main";
import { Id_Schema } from ":schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { renderToReadableStream } from "hono/jsx/streaming";
import { z } from "zod";
import { hyyyyyypertool_session, type Session_Context } from "../session";
import { _01, PageContext_01, Table as Table_01 } from "./01";
import { _02, Duplicate_Warning, List_Leaders } from "./02";
import { _03 } from "./03";
import { _04 } from "./04";

//

export default new Hono<Session_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
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
    function ({ render, req, get, redirect }) {
      const { id } = req.valid("query");
      const session = get("session");
      const userinfo = session.get("userinfo");
      if (!userinfo) {
        return redirect("/");
      }
      const { usual_name, given_name } = userinfo;
      const username = `${given_name} ${usual_name}`;

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
        {
          username,
        },
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
  )
  .route(
    "/_/02",
    new Hono()
      .get(
        "/duplicate_warning",
        zValidator(
          "query",
          z.object({
            organization_id: z.string(),
            user_id: z.string(),
          }),
        ),
        async function ({ html, req }) {
          const { organization_id, user_id } = req.valid("query");
          return html(
            <Duplicate_Warning
              organization_id={Number(organization_id)}
              user_id={Number(user_id)}
            />,
          );
        },
      )
      .get("/domains/internal/edit", async function ({ html, req }) {
        return html(<>/domains/internal/edit</>);
      })
      .get("/domains/external/edit", async function ({ html, req }) {
        return html(<>/domains/external/edit</>);
      })
      .get(
        "/list_leaders",
        zValidator(
          "query",
          z.object({
            siret: z.string(),
          }),
        ),
        async function ({ html, req }) {
          const { siret } = req.valid("query");
          return html(<List_Leaders siret={siret} />);
        },
      ),
  );
