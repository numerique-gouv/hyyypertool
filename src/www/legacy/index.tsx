//

/// <reference types="moncomptepro/src/types/moderation.d.ts" />
/// <reference types="moncomptepro/src/types/user" />

import { prisma } from ":database";
import { Main_Layout } from ":layout/main";
import type { ElysiaWWW } from ":www";
import type { Prisma, moderations, organizations, users } from "@prisma/client";
import { t } from "elysia";
import queryString from "query-string";
import { tv, type VariantProps } from "tailwind-variants";
import { match } from "ts-pattern";

//

export default (www: ElysiaWWW) =>
  www
    .get("/", async function ({ query, request }) {
      const url_query_params = queryString.stringify(query);
      console.log();
      return (
        <Main_Layout>
          <div
            hx-get={`${
              new URL(request.url).pathname
            }/_01?${url_query_params.toString()}`}
            hx-trigger="load"
            hx-target="this"
          />
        </Main_Layout>
      );
    })
    .get("/_01", async function ({ query, request }) {
      return (
        <div class="prose mx-auto mt-6 !max-w-4xl">
          <h1>🖱️ 1. Je sélectionne le cas que je veux traiter</h1>
          <hr />
          <input
            hx-post={`${new URL(request.url).pathname}_table`}
            hx-target="#search-results"
            hx-trigger="input changed delay:500ms, search"
            id="search-siret"
            name="search-siret"
            placeholder="Recherche par SIRET"
            type="search"
          />
          <input
            hx-post={`${new URL(request.url).pathname}_table`}
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
            hx-post={`${new URL(request.url).pathname}_table?${queryString
              .stringify(query)
              .toString()}`}
            hx-trigger="load"
            hx-target="this"
          />
        </div>
      );
    })

    .post(
      "/_01_table",
      async function ({ query, body }) {
        const search_siret = body["search-siret"];
        const search_email = body["search-email"];
        const page = body["page"] ?? 0;
        const take = 25;

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

        const moderation_id = query["moderation_id"];
        return (
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
                <td colspan="2">
                  {page * take}-{page * take + take} of {count}
                </td>
                <td colspan="2" class="inline-flex justify-center">
                  <input
                    value={String(page)}
                    type="number"
                    class="text-right"
                    hx-post={`/legacy/_01_table`}
                    hx-target="#search-results"
                    hx-trigger="input changed delay:500ms, search"
                    id="page"
                    name="page"
                  />
                  <span> of {count}</span>
                </td>
              </tr>
            </tfoot>
          </table>
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
              hx-get={`/legacy  /_?moderation_id=${moderation.id}`}
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
      },
      {
        body: t.Partial(
          t.Object({
            page: t.Number(),
            "search-siret": t.String(),
            "search-email": t.String(),
          }),
        ),
      },
    );

const row = tv({ variants: { is_active: { true: "bg-green-300" } } });
