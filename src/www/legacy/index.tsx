//

import { prisma } from ":database";
import { Main_Layout } from ":layout/main";
import { zValidator } from "@hono/zod-validator";
import type { Prisma, moderations, organizations, users } from "@prisma/client";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Suspense } from "hono/jsx/streaming";
import { tv, type VariantProps } from "tailwind-variants";
import { match } from "ts-pattern";
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

const Id_Schema = z.object({
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
    async ({ html, req, notFound }) => {
      const { id } = req.valid("param");
      const moderation_id = Number(id);
      if (isNaN(moderation_id)) return notFound();

      return html(
        <>
          <_02 moderation_id={moderation_id} />
          <_03 moderation_id={Number(id)} />
          <_04 moderation_id={Number(id)} />
        </>,
      );
    },
  )
  .route(
    "/_/01",
    new Hono()
      .get(
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
      )
      .get(
        "/table/select/:id",
        zValidator("param", Id_Schema),
        function ({ html, req }) {
          return html(<>sdf</>, 200, {
            "HX-Redirect": `/legacy?id=${req.valid("param").id}`,
          });
        },
      ),
  )
  .route(
    "/_/011",
    new Hono()
      .get("/", Id_SchemaValidator, function ({ html, req }) {
        const { id } = req.valid("query");
        return html(
          <Suspense fallback={<p>Loading...</p>}>
            <div class="mx-auto mt-6 !max-w-4xl">
              <h1>🖱️ 1. Je sélectionne le cas que je veux traiter</h1>
              <hr />
              <label class="fr-label" for="search-siret">
                Siret
              </label>
              <input
                class="fr-input"
                hx-get={`${base}/_/01/table`}
                hx-include="#search-email"
                hx-target="#search-results"
                hx-trigger="input changed delay:500ms, search"
                id="search-siret"
                name="search-siret"
                placeholder="Recherche par SIRET"
                type="search"
              />
              <label class="fr-label" for="search-email">
                Email
              </label>
              <input
                class="fr-input"
                hx-get={`${base}/_/01/table`}
                hx-include="#search-siret"
                hx-target="#search-results"
                hx-trigger="input changed delay:500ms, search"
                id="search-email"
                name="search-email"
                placeholder="Recherche par Email"
                type="email"
              />
              <div
                class="fr-table"
                id="search-results"
                hx-get={`${base}/_/01/table`}
                include-vals={`id:${id}`}
                hx-trigger="load"
                hx-target="this"
              />
            </div>
          </Suspense>,
        );
      })
      .get(
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
            id: moderation_id,
            page: _page,
            "search-email": search_email,
            "search-siret": search_siret,
          } = req.valid("query");

          const page = Number(_page ?? 0);
          const take = 5;

          const where: Prisma.moderationsWhereInput = {
            moderated_at: null,
            organizations: { siret: { contains: search_siret } },
            users: { email: { contains: search_email } },
          };

          const [moderations, count] = await prisma.$transaction([
            prisma.moderations.findMany({
              include: { organizations: true, users: true },
              orderBy: { created_at: "asc" },
              skip: page * take,
              take,
              where,
            }),
            prisma.moderations.count({ where }),
          ]);

          return html(
            <table>
              <thead>
                <tr>
                  <th>Cat</th>
                  <th>Creation date</th>
                  <th>Given Name</th>
                  <th>Family Name</th>
                  <th>Email</th>
                  <th>Moderation_id</th>
                </tr>
              </thead>
              <tbody>
                {moderations.map(function (moderation) {
                  return (
                    <Row
                      moderation={moderation}
                      variants={{
                        is_active:
                          Number(moderation_id) === Number(moderation.id),
                      }}
                    />
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Showing </th>
                  <td colspan={2}>
                    {page * take}-{page * take + take} of {count}
                  </td>
                  <td colspan={2} class="inline-flex justify-center">
                    <input
                      class="text-right"
                      hx-get={`${base}/_/01/table`}
                      hx-include="#search-email,#search-siret"
                      hx-target="#search-results"
                      hx-trigger="input changed delay:500ms"
                      id="page"
                      name="page"
                      type="number"
                      value={String(page)}
                    />
                    <span> of {Math.floor(count / take)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>,
          );

          //

          function Row({
            moderation,
            variants,
          }: {
            moderation: moderations & {
              users: users;
              organizations: organizations;
            };
            variants: VariantProps<typeof row>;
          }) {
            const { users, organizations } = moderation;
            return (
              <tr
                class={row(variants)}
                hx-get={`${base}/_/01/table/select/${moderation.id}`}
              >
                <td safe title={moderation.type}>
                  {match(moderation.type as Moderation["type"])
                    // .with("big_organization_join", () => "🏢")
                    .with("non_verified_domain", () => "🔓")
                    .with("organization_join_block", () => "🕵️")
                    .with("ask_for_sponsorship", () => "🧑‍🤝‍🧑")
                    .otherwise(() => "?")}
                </td>
                <td>
                  <span safe>
                    {users.created_at.toLocaleDateString("fr-FR")}
                  </span>{" "}
                  <span safe>
                    {users.created_at.toLocaleTimeString("fr-FR")}
                  </span>
                </td>
                <td safe>{users.given_name}</td>
                <td safe>{users.family_name}</td>
                <td safe>{users.email}</td>
                <td>{moderation.id}</td>
              </tr>
            );
          }
        },
      )
      .get(
        "/table/select/:id",
        zValidator("param", Id_Schema),
        function ({ text, req }) {
          return text("", 200, {
            "HX-Redirect": `/legacy?id=${req.valid("param").id}#02`,
          });
        },
      ),
  )
  .route(
    "/_/02",
    new Hono()
      .get(
        "/",
        zValidator("query", Id_Schema),
        async function ({ html, req, notFound }) {
          const { id } = req.valid("query");
          const moderation_id = Number(id);
          if (isNaN(moderation_id)) return notFound();
          const moderation = await prisma.moderations.findUniqueOrThrow({
            include: { organizations: true, users: true },
            where: { id: moderation_id },
          });

          const domain = moderation.users.email.split("@")[1];
          const moderationCount = await prisma.moderations.count({
            where: {
              organization_id: moderation.organization_id,
              user_id: moderation.user_id,
            },
          });
          return html(
            <Suspense fallback={<p>Loading...</p>}>
              <div class=" mx-auto mt-6 !max-w-4xl">
                <h1>🗃️ 2. Je consulte les données relative au cas à l'étude</h1>

                {moderationCount > 1 ? (
                  <div class="fr-alert fr-alert--warning">
                    <h3 class="fr-alert__title">
                      Attention : demande multiples
                    </h3>
                    <p>
                      Il s'agit de la {moderationCount}e demande pour cette
                      organisation
                    </p>
                  </div>
                ) : null}

                <hr />

                <h2>
                  🤗 <span safe>{moderation.users.given_name}</span>{" "}
                  <span safe>
                    {match(moderation.type as Moderation["type"])
                      .with(
                        "ask_for_sponsorship",
                        () => "demande un sponsorship",
                      )
                      .with(
                        "non_verified_domain",
                        () =>
                          "a rejoint une organisation avec un domain non vérifié  ",
                      )
                      .with(
                        "organization_join_block",
                        () => "veut rejoindre l'organisation",
                      )
                      .otherwise(
                        (type) =>
                          `veut effectuer une action inconnue (type ${type})`,
                      )}
                  </span>{" "}
                  « <span safe>{moderation.organizations.cached_libelle}</span>{" "}
                  »
                </h2>
              </div>
            </Suspense>,
          );
        },
      )
      .get("/table", Query_SchemaValidator, async function ({ html, req }) {
        const {
          page: _page,
          "search-email": search_email,
          "search-siret": search_siret,
        } = req.valid("query");

        const page = Number(_page ?? 0);
        const take = 5;

        const moderation_id = ""; //query["moderation_id"];

        const where: Prisma.moderationsWhereInput = {
          moderated_at: null,
          organizations: { siret: { contains: search_siret } },
          users: { email: { contains: search_email } },
        };

        const [moderations, count] = await prisma.$transaction([
          prisma.moderations.findMany({
            include: { organizations: true, users: true },
            orderBy: { created_at: "asc" },
            skip: page * take,
            take,
            where,
          }),
          prisma.moderations.count({ where }),
        ]);

        return html(
          <table>
            <thead>
              <tr>
                <th>Cat</th>
                <th>Creation date</th>
                <th>Given Name</th>
                <th>Family Name</th>
                <th>Email</th>
                <th>Moderation_id</th>
              </tr>
            </thead>
            <tbody>
              {moderations.map(function (moderation) {
                return (
                  <Row
                    moderation={moderation}
                    variants={{
                      is_active: Number(moderation_id) === moderation.id,
                    }}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Showing </th>
                <td colspan={2}>
                  {page * take}-{page * take + take} of {count}
                </td>
                <td colspan={2} class="inline-flex justify-center">
                  <input
                    class="text-right"
                    hx-get={`${base}/_/01/table`}
                    hx-include="#search-email,#search-siret"
                    hx-target="#search-results"
                    hx-trigger="input changed delay:500ms"
                    id="page"
                    name="page"
                    type="number"
                    value={String(page)}
                  />
                  <span> of {Math.floor(count / take)}</span>
                </td>
              </tr>
            </tfoot>
          </table>,
        );

        //

        function Row({
          moderation,
          variants,
        }: {
          moderation: moderations & {
            users: users;
            organizations: organizations;
          };
          variants: VariantProps<typeof row>;
        }) {
          const { users, organizations } = moderation;
          return (
            <tr
              class={row(variants)}
              hx-get={`${base}/_?moderation_id=${moderation.id}`}
              hx-target="#dashboard"
              hx-swap="outerHTML"
            >
              <td safe title={moderation.type}>
                {match(moderation.type as Moderation["type"])
                  // .with("big_organization_join", () => "🏢")
                  .with("non_verified_domain", () => "🔓")
                  .with("organization_join_block", () => "🕵️")
                  .with("ask_for_sponsorship", () => "🧑‍🤝‍🧑")
                  .otherwise(() => "?")}
              </td>
              <td>
                <span safe>{users.created_at.toLocaleDateString("fr-FR")}</span>{" "}
                <span safe>{users.created_at.toLocaleTimeString("fr-FR")}</span>
              </td>
              <td safe>{users.given_name}</td>
              <td safe>{users.family_name}</td>
              <td safe>{users.email}</td>
              <td>{moderation.id}</td>
            </tr>
          );
        }
      }),
  );

const row = tv({ variants: { is_active: { true: "!bg-green-300" } } });
