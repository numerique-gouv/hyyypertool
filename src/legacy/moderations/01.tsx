//

import { api_ref } from ":api_ref";
import { date_to_string } from ":common/date";
import { Htmx_Events, hx_include, prefix_id } from ":common/htmx";
import type { Moderation, User } from ":database:moncomptepro";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { row } from ":ui/table";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNotNull,
  isNull,
} from "drizzle-orm";
import { html } from "hono/html";
import { createContext, useContext } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import { type VariantProps } from "tailwind-variants";
import { moderation_type_to_emoji } from "./moderation_type_to_emoji";

//

export const PageContext_01_default = {
  active_id: NaN,
  page: 0,
  take: 5,
  search: { email: "", siret: "", show_archived: false },
};
export const PageContext_01 = createContext(PageContext_01_default);

export const SEARCH_SIRET_INPUT_ID = "search-siret";
export const SEARCH_EMAIL_INPUT_ID = "search-email";
export const PROCESSED_REQUESTS_INPUT_ID = "processed_requests";
export const MODERATION_TABLE_ID = "moderation-table";

export function _01() {
  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="01">
      <h1>🖱️ 1. Je sélectionne le cas que je veux traiter</h1>
      <hr />
      <div class="fr-input-group ">
        <label class="fr-label" for={SEARCH_SIRET_INPUT_ID}>
          Siret
        </label>
        <input
          class="fr-input"
          hx-get={api_ref("/legacy/moderations", {})}
          hx-include={hx_include([
            PROCESSED_REQUESTS_INPUT_ID,
            SEARCH_EMAIL_INPUT_ID,
          ])}
          hx-target={`#${MODERATION_TABLE_ID}`}
          hx-trigger="input changed delay:500ms, search"
          id={SEARCH_SIRET_INPUT_ID}
          name={SEARCH_SIRET_INPUT_ID}
          placeholder="Recherche par SIRET"
          type="search"
        />
      </div>
      <div class="fr-input-group ">
        <label class="fr-label" for={SEARCH_EMAIL_INPUT_ID}>
          Email
        </label>
        <input
          class="fr-input"
          hx-get={api_ref("/legacy/moderations", {})}
          hx-include={hx_include([
            PROCESSED_REQUESTS_INPUT_ID,
            SEARCH_SIRET_INPUT_ID,
          ])}
          hx-target={prefix_id(MODERATION_TABLE_ID)}
          hx-trigger="input changed delay:500ms, search"
          id={SEARCH_EMAIL_INPUT_ID}
          name={SEARCH_EMAIL_INPUT_ID}
          placeholder="Recherche par Email"
          type="email"
        />
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            aria-describedby="checkboxes-1-messages"
            hx-get={api_ref("/legacy/moderations", {})}
            hx-include={hx_include([
              SEARCH_EMAIL_INPUT_ID,
              SEARCH_SIRET_INPUT_ID,
            ])}
            hx-target={prefix_id(MODERATION_TABLE_ID)}
            id={PROCESSED_REQUESTS_INPUT_ID}
            name={PROCESSED_REQUESTS_INPUT_ID}
            value="true"
            type="checkbox"
          />
          <label class="fr-label" for={PROCESSED_REQUESTS_INPUT_ID}>
            Voir les demandes traitées
          </label>
          <div
            class="fr-messages-group"
            id="checkboxes-1-messages"
            aria-live="assertive"
          ></div>
        </div>
      </div>
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
    search.show_archived
      ? isNotNull(schema.moderations.moderated_at)
      : isNull(schema.moderations.moderated_at),
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
  const last_page = Math.floor(count / take);
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
        on ${Htmx_Events.Enum["htmx:afterOnLoad"]}
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
              moderation={{ ...moderations, users }}
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
            <button
              disabled={page <= 0}
              hx-get={api_ref("/legacy/moderations", {})}
              hx-include={hx_include([
                PROCESSED_REQUESTS_INPUT_ID,
                SEARCH_EMAIL_INPUT_ID,
                SEARCH_SIRET_INPUT_ID,
              ])}
              hx-target={prefix_id(MODERATION_TABLE_ID)}
              hx-vals={JSON.stringify({
                page: page - 1,
              })}
            >
              Précédent
            </button>

            <input
              class="max-w-12 text-right"
              hx-get={api_ref("/legacy/moderations", {})}
              hx-include={hx_include([
                PROCESSED_REQUESTS_INPUT_ID,
                SEARCH_EMAIL_INPUT_ID,
                SEARCH_SIRET_INPUT_ID,
              ])}
              hx-trigger="input changed delay:500ms"
              hx-target={prefix_id(MODERATION_TABLE_ID)}
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {last_page}</span>

            <button
              disabled={page >= last_page}
              hx-get={api_ref("/legacy/moderations", {})}
              hx-include={hx_include([
                PROCESSED_REQUESTS_INPUT_ID,
                SEARCH_EMAIL_INPUT_ID,
                SEARCH_SIRET_INPUT_ID,
              ])}
              hx-target={prefix_id(MODERATION_TABLE_ID)}
              hx-vals={JSON.stringify({
                page: page + 1,
              })}
            >
              Suivant
            </button>
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
  };
  variants: VariantProps<typeof row>;
}) {
  const { users } = moderation;
  return (
    <tr
      aria-selected="false"
      class={row(variants)}
      hx-get={api_ref("/legacy/moderations/:id", { id: String(moderation.id) })}
      hx-target="#moderation"
      hx-push-url={`/legacy?id=${moderation.id}`}
    >
      <td title={moderation.type}>
        {moderation_type_to_emoji(moderation.type)}
      </td>
      <td>{date_to_string(users.created_at)}</td>
      <td>{users.given_name}</td>
      <td>{users.family_name}</td>
      <td>{users.email}</td>
      <td>{moderation.id}</td>
    </tr>
  );
}
