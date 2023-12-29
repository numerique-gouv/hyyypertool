//

import type { Moderation, Organization, User } from ":database:moncomptepro";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import type { MCP_Moderation } from ":moncomptepro";
import { api_ref } from ":paths";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNull,
} from "drizzle-orm";
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

export const SEARCH_SIRET_INPUT_ID = "search-siret";
export const SEARCH_EMAIL_INPUT_ID = "search-email";
export const MODERATION_TABLE_ID = "moderation-table";

export function _01() {
  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="01">
      <h1>🖱️ 1. Je sélectionne le cas que je veux traiter</h1>
      <hr />
      <label class="fr-label" for="search-siret">
        Siret
      </label>
      <input
        class="fr-input"
        hx-get={api_ref("/legacy/moderations", {})}
        hx-include={`#${SEARCH_EMAIL_INPUT_ID}`}
        hx-target={`#${MODERATION_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_SIRET_INPUT_ID}
        name="search-siret"
        placeholder="Recherche par SIRET"
        type="search"
      />
      <label class="fr-label" for="search-email">
        Email
      </label>
      <input
        class="fr-input"
        hx-get={api_ref("/legacy/moderations", {})}
        hx-include={`#${SEARCH_SIRET_INPUT_ID}`}
        hx-target={`#${MODERATION_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_EMAIL_INPUT_ID}
        name="search-email"
        placeholder="Recherche par Email"
        type="email"
      />
      <Suspense fallback={<p>Loading...</p>}>
        <div class="fr-table" id={MODERATION_TABLE_ID}>
          <Table />
        </div>
      </Suspense>
    </div>
  );
}

export async function Table() {
  const { active_id, page, search, take } = useContext(PageContext_01);

  const where = and(
    ilike(schema.organizations.siret, `%${search.siret}%`),
    ilike(schema.users.email, `%${search.email}%`),
    isNull(schema.moderations.moderated_at),
  );
  const { moderations, count } = await moncomptepro_pg.transaction(async () => {
    const moderations = await moncomptepro_pg
      .select()
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where)
      .orderBy(asc(schema.moderations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await moncomptepro_pg
      .select({ value: drizzle_count() })
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where);
    return { moderations, count };
  });

  return (
    <table class="!table">
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
        _={`
        on htmx:afterOnLoad
        set @aria-selected of <[aria-selected=true]/> to false
        tell the target take .is_active set @aria-selected to true
        go to the top of #moderation smoothly
     `}
      >
        {html`
          <style>
            .fr-table tbody tr.is_active {
              --tw-bg-opacity: 1;
              background-color: rgb(134 239 172 / var(--tw-bg-opacity));
            }
          </style>
        `}
        {moderations.map(function ({ moderations, users, organizations }) {
          return (
            <Row
              moderation={{ ...moderations, users, organizations }}
              variants={{
                is_active: active_id === moderations.id,
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
              hx-get={api_ref("/legacy/moderations", {})}
              hx-include={`#${SEARCH_EMAIL_INPUT_ID},#${SEARCH_SIRET_INPUT_ID}`}
              hx-trigger="input changed delay:500ms"
              hx-target={`#${MODERATION_TABLE_ID}`}
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
  moderation: Moderation & {
    users: User;
    organizations: Organization;
  };
  variants: VariantProps<typeof row>;
}) {
  const { users, organizations } = moderation;
  return (
    <tr
      aria-selected="false"
      class={row(variants)}
      hx-get={api_ref("/legacy/moderations/:id", { id: String(moderation.id) })}
      hx-target="#moderation"
      hx-push-url={`/legacy?id=${moderation.id}`}
    >
      <td safe title={moderation.type}>
        {match(moderation.type as MCP_Moderation["type"])
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
