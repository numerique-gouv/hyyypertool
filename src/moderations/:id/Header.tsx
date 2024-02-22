//

import type { MCP_Moderation } from ":moncomptepro";
import { button } from ":ui/button";
import { callout } from ":ui/callout";
import { LocalTime } from ":ui/time/LocalTime";
import { urls } from "@~/app.urls";
import { moderation_type_to_emoji } from "@~/moderations.lib/moderation_type.mapper";
import type { Moderation } from "@~/moncomptepro.database";
import { useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { ModerationPage_Context } from "./context";

//

export function Header() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <header>
      <section class="flex items-baseline space-x-5">
        <h1>
          <span>
            {moderation_type_to_emoji(moderation.type)}{" "}
            {moderation.users.given_name} {moderation.users.family_name}
          </span>
        </h1>
        <div>
          <State_Badge />
        </div>
      </section>

      <hr class="bg-none" />

      <ModerationCallout moderation={moderation} />

      <hr class="bg-none" />

      <Info />

      <hr class="bg-none" />

      <div
        hx-get={urls.moderations.duplicate_warning.$url().pathname}
        hx-trigger="load"
        hx-vals={JSON.stringify({
          organization_id: moderation.organization_id,
          user_id: moderation.user_id,
        })}
      >
        Demande multiples ?
      </div>
    </header>
  );
}

function State_Badge() {
  const { moderation } = useContext(ModerationPage_Context);
  const is_treated = moderation.moderated_at !== null;
  if (is_treated) return <p class="fr-badge fr-badge--success">Traité</p>;
  return <p class="fr-badge fr-badge--new">A traiter</p>;
}

function Info() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <div class="fr-notice fr-notice--info">
      <div class="fr-container">
        <div class="fr-notice__body">
          <p class="fr-notice__title">
            <b>
              {moderation.users.given_name} {moderation.users.family_name}
            </b>{" "}
            <span class="text-gray-600">
              {match(moderation.type as MCP_Moderation["type"])
                .with("ask_for_sponsorship", () => "demande un sponsorship")
                .with(
                  "big_organization_join",
                  () => "a rejoint l'organisation de plus de 50 employés",
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
                  (type) => `veut effectuer une action inconnue (type ${type})`,
                )}
            </span>{" "}
            « <b>{moderation.organizations.cached_libelle}</b> »{" "}
            <span class="text-gray-600">avec l’adresse</span>{" "}
            <b>{moderation.users.email}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

function ModerationCallout({ moderation }: { moderation: Moderation }) {
  if (!moderation.moderated_at) return <></>;
  const { base, text, title } = callout({ intent: "success" });
  return (
    <div class={base()}>
      <h3 class={text()}>Modération traitée</h3>
      <p class={title()}>
        Cette modération a été marqué comme traitée le{" "}
        <b>
          <LocalTime date={moderation.moderated_at} />
        </b>
        {moderation.moderated_by ? (
          <>
            {" "}
            par <b>{moderation.moderated_by}</b>
          </>
        ) : (
          <></>
        )}
        .
      </p>
      <button
        class={button({ size: "sm", type: "tertiary" })}
        hx-patch={
          urls.legacy.moderations[":id"].reprocess.$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
        hx-swap="none"
      >
        Retraiter
      </button>
    </div>
  );
}
