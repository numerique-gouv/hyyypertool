//

import { prisma } from ":database";
import type { Prisma, moderations, organizations, users } from "@prisma/client";
import { html } from "hono/html";
import { createContext, useContext } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import { tv, type VariantProps } from "tailwind-variants";
import { match } from "ts-pattern";

//

export const PageContext_01 = createContext({
  active_id: NaN,
  page: 0,
  take: 5,
  search: { email: "", siret: "" },
});

export function _01() {
  return (
    <div class="mx-auto mt-6 !max-w-4xl" id="01">
      <h1>🖱️ 1. Je sélectionne le cas que je veux traiter</h1>
      <hr />
      <label class="fr-label" for="search-siret">
        Siret
      </label>
      <input
        class="fr-input"
        hx-get={`/legacy/_/01/table`}
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
        hx-get={`/legacy/_/01/table`}
        hx-include="#search-siret"
        hx-target="#search-results"
        hx-trigger="input changed delay:500ms, search"
        id="search-email"
        name="search-email"
        placeholder="Recherche par Email"
        type="email"
      />
      <Suspense fallback={<p>Loading...</p>}>
        <div class="fr-table" id="search-results">
          <Table />
        </div>
      </Suspense>
    </div>
  );
}

export async function Table() {
  const { active_id, page, search, take } = useContext(PageContext_01);

  const where: Prisma.moderationsWhereInput = {
    moderated_at: null,
    organizations: { siret: { contains: search.siret } },
    users: { email: { contains: search.email } },
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
      <tbody
        _="
         on htmx:afterOnLoad
         set @aria-selected of <[aria-selected=true]/> to false
         tell the target take .is_active set @aria-selected to true
         go to the top of #moderation smoothly
      "
      >
        {html`
          <style>
            .fr-table tbody tr.is_active {
              --tw-bg-opacity: 1;
              background-color: rgb(134 239 172 / var(--tw-bg-opacity));
            }
          </style>
        `}
        {moderations.map(function (moderation) {
          return (
            <Row
              moderation={moderation}
              variants={{
                is_active: active_id === Number(moderation.id),
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
              hx-get={`/legacy/_/01/table`}
              hx-include="#search-email,#search-siret"
              hx-trigger="input changed delay:500ms"
              hx-target="#search-results"
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {Math.floor(count / take)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

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
      aria-selected="false"
      class={row(variants)}
      hx-get={`/legacy/_/moderation/${moderation.id}`}
      hx-target="#moderation"
      hx-push-url={`/legacy?id=${moderation.id}`}
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

const row = tv({ variants: { is_active: { true: "is_active" } } });
// const row = tv({ variants: { is_active: { true: "!bg-green-300" } } });
