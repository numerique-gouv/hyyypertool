//

import { api_ref } from ":api_ref";
import type { Users_Organizations } from ":database:moncomptepro";
import { app_hc } from ":hc";
import {
  Verification_Type_Schema,
  type Verification_Type,
} from ":organizations/services/verification_type";
import { button } from ":ui/button";
import { CopyButton } from ":ui/button/copy";
import { row } from ":ui/table";
import { createContext, useContext } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";

//

type RowData = User &
  Pick<Users_Organizations, "is_external" | "verification_type">;

//

export const Table_Context = createContext({
  page: 0,
  take: 5,
  count: 0,
});

//

export function Table({
  organization_id,
  users,
}: {
  organization_id: number;
  users: Array<RowData>;
}) {
  const { page, take, count } = useContext(Table_Context);

  return (
    <table class="!table">
      <thead>
        <tr>
          <th>Given Name</th>
          <th>Family Name</th>
          <th>Interne</th>
          <th>Email</th>
          <th>Job</th>
          <th>verification_type</th>
          <th>Lien</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <>
            <Row user={user} />
            <Actions user={user} organization_id={organization_id} />
          </>
        ))}
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
              hx-get={
                app_hc.legacy.organizations[":id"].members.$url({
                  param: { id: organization_id.toString() },
                }).pathname
              }
              hx-trigger="input changed delay:2s"
              hx-target="#table-organisation-members"
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
  user,
  variants,
}: {
  user: RowData;
  variants?: VariantProps<typeof row>;
}) {
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
        <a
          class="p-3"
          href={api_ref("/legacy/users/:id", { id: user.id.toString() })}
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}

function Actions({
  user,
  organization_id,
}: {
  user: RowData;
  organization_id: number;
}) {
  const { email, id: user_id, is_external, verification_type } = user;

  return (
    <tr>
      <td colspan={7}>
        <button
          class={button()}
          hx-delete={
            app_hc.legacy.organizations[":id"].members[":user_id"].$url({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            }).pathname
          }
          hx-swap="none"
        >
          🚪🚶retirer de l'orga
        </button>
        <button
          class={button()}
          hx-patch={
            app_hc.legacy.organizations[":id"].members[":user_id"].$url({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            }).pathname
          }
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.in_liste_dirigeants_rna,
          })}
        >
          🔄 vérif: liste dirigeants
        </button>
        <button
          class={button()}
          hx-patch={
            app_hc.legacy.organizations[":id"].members[":user_id"].$url({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            }).pathname
          }
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.verified_email_domain,
          })}
        >
          🔄 vérif: domaine email
        </button>
        <button
          class={button()}
          hx-patch={
            app_hc.legacy.organizations[":id"].members[":user_id"].$url({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            }).pathname
          }
          hx-swap="none"
          hx-vals={JSON.stringify({
            verification_type:
              Verification_Type_Schema.Enum.official_contact_email,
          })}
        >
          🔄 vérif: mail officiel
        </button>
        {verification_type ? (
          <button
            class={button({ intent: "danger" })}
            hx-patch={
              app_hc.legacy.organizations[":id"].members[":user_id"].$url({
                param: {
                  id: organization_id.toString(),
                  user_id: user_id.toString(),
                },
              }).pathname
            }
            hx-swap="none"
            hx-vals={JSON.stringify({ verification_type: "" })}
          >
            🚫 non vérifié
          </button>
        ) : (
          <></>
        )}
        <button
          class={button()}
          hx-patch={
            app_hc.legacy.organizations[":id"].members[":user_id"].$url({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
            }).pathname
          }
          hx-swap="none"
          hx-vals={JSON.stringify({
            is_external: !is_external,
          })}
        >
          🔄 interne/externe
        </button>
        <CopyButton text={email}>copier email</CopyButton>
      </td>
    </tr>
  );
}