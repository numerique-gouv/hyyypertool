//

import { hx_include } from "@~/app.core/htmx";
import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { Foot } from "@~/app.ui/hx_table";
import { menu_item } from "@~/app.ui/menu";
import { Horizontal_Menu } from "@~/app.ui/menu/components/Horizontal_Menu";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "@~/app.urls";
import {
  Verification_Type_Schema,
  type Verification_Type,
} from "@~/moncomptepro.lib/verification_type";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import type { VariantProps } from "tailwind-variants";
import {
  MEMBER_TABLE_PAGE_ID,
  Member_Context,
  MembersTable_Context,
} from "./context";

//

export async function Table() {
  const { describedby, organization_id, pagination, query_members_collection } =
    useContext(MembersTable_Context);

  const { users, count } = await query_members_collection;

  const hx_member_query_props = {
    ...hx_urls.organizations[":id"].members.$get({
      param: {
        id: organization_id.toString(),
      },
      query: { describedby },
    }),
    "hx-include": hx_include([MEMBER_TABLE_PAGE_ID]),
  };

  return (
    <div class="fr-table [&>table]:table">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Interne</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>Type de vérification</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <Member_Context.Provider value={{ user }}>
              <Row />
            </Member_Context.Provider>
          ))}
        </tbody>

        <Foot
          count={count}
          hx_query_props={hx_member_query_props}
          id={MEMBER_TABLE_PAGE_ID}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ variants }: { variants?: VariantProps<typeof row> }) {
  const { user } = useContext(Member_Context);
  const verification_type = user.verification_type as Verification_Type;
  return (
    <tr class={row(variants)}>
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.is_external ? "❌" : "✅"}</td>
      <td>{user.email}</td>
      <td>{user.job}</td>
      <td>{verification_type}</td>
      <td>
        <Row_Actions />
      </td>
    </tr>
  );
}

function Row_Actions() {
  const { organization_id } = useContext(MembersTable_Context);
  const { user } = useContext(Member_Context);
  const { id: user_id, is_external, verification_type } = user;

  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <a
            class={menu_item({ override: "[href]" })}
            href={
              urls.users[":id"].$url({ param: { id: user.id.toString() } })
                .pathname
            }
          >
            Ouvrir
          </a>
        </li>
        <li>
          <button
            class={menu_item()}
            {...hx_urls.organizations[":id"].members[":user_id"].$delete({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            })}
            hx-swap="none"
          >
            🚪🚶retirer de l'orga
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            })}
            hx-swap="none"
            hx-vals={JSON.stringify({
              verification_type:
                Verification_Type_Schema.Enum.in_liste_dirigeants_rna,
            })}
          >
            🔄 vérif: liste dirigeants
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            })}
            hx-swap="none"
            hx-vals={JSON.stringify({
              verification_type:
                Verification_Type_Schema.Enum.verified_email_domain,
            })}
          >
            🔄 vérif: domaine email
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            })}
            hx-swap="none"
            hx-vals={JSON.stringify({
              verification_type:
                Verification_Type_Schema.Enum.official_contact_email,
            })}
          >
            🔄 vérif: mail officiel
          </button>
        </li>
        <li>
          {verification_type ? (
            <button
              class={menu_item()}
              {...hx_urls.organizations[":id"].members[":user_id"].$patch({
                param: {
                  id: organization_id.toString(),
                  user_id: user_id.toString(),
                },
              })}
              hx-swap="none"
              hx-vals={JSON.stringify({ verification_type: "" })}
            >
              🚫 non vérifié
            </button>
          ) : (
            <></>
          )}
        </li>
        <li>
          <button
            class={menu_item()}
            {...hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            })}
            hx-swap="none"
            hx-vals={JSON.stringify({
              is_external: !is_external,
            })}
          >
            🔄 interne/externe
          </button>
        </li>
      </ul>
    </Horizontal_Menu>
  );
}

export async function MembersTable_Provider({
  value: { describedby, pagination, organization_id },
  children,
}: PropsWithChildren<{
  value: {
    describedby: string;
    pagination: Pagination;
    organization_id: number;
  };
}>) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const query_members_collection = get_users_by_organization_id(
    moncomptepro_pg,
    {
      organization_id,
      pagination: { ...pagination, page: pagination.page - 1 },
    },
  );

  return (
    <MembersTable_Context.Provider
      value={{
        describedby,
        query_members_collection,
        organization_id,
        pagination,
      }}
    >
      {children}
    </MembersTable_Context.Provider>
  );
}
