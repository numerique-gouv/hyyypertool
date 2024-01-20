//

import { date_to_string } from ":common/date";
import env from ":common/env";
import { Htmx_Events, hx_include, hx_trigger_from_body } from ":common/htmx";
import {
  moncomptepro_pg,
  schema,
  type Moderation,
  type Organization,
  type User,
} from ":database:moncomptepro";
import { app_hc } from ":hc";
import { get_zammad_mail } from ":legacy/services/zammad_api";
import { button } from ":ui/button";
import { callout } from ":ui/callout";
import { Loader } from ":ui/loader/Loader";
import { eq } from "drizzle-orm";
import { createSlot } from "hono-slotify/index";
import { ok } from "node:assert";
import { dedent } from "ts-dedent";
import { Message } from "./Message";
import { MODERATION_EVENTS } from "./event";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";
export const MAX_ARTICLE_COUNT = 3;

//

export async function _03({ moderation_id }: { moderation_id: number }) {
  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
    with: {
      organizations: true,
      users: true,
    },
  });

  ok(moderation);

  return (
    <div class="mx-auto !max-w-6xl">
      <h1>✉️ 3. J'ai pris ma décision</h1>

      <hr />

      <h2>Valider la modération : </h2>
      <SendModerationProcessedEmail moderation={moderation} />
      <MarkModerationProcessed moderation={moderation} />

      <hr />

      <h2>Rejeter la modération : </h2>

      <div
        hx-get={
          app_hc.legacy.moderations[":id"].email.$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
        hx-trigger={[
          "load",
          hx_trigger_from_body([
            MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
          ]),
        ].join(", ")}
      >
        <div class="my-24 flex flex-col items-center justify-center">
          Chargement des échanges avec {moderation.users.given_name}
          <br />
          <Loader />
        </div>
      </div>

      <MarkModerationProcessed moderation={moderation} />

      <hr />

      <div class="fr-select-group">
        <label class="fr-label" for={RESPONSE_MESSAGE_SELECT_ID}>
          <h6>Motif de rejet : </h6>
        </label>
        <ResponseMessageSelector moderation={moderation} />
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={RESPONSE_TEXTAREA_ID}
        >
          Texte
          <button
            _={`
            on click
              set text to #${RESPONSE_TEXTAREA_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <textarea
          class="fr-input"
          rows={20}
          id={RESPONSE_TEXTAREA_ID}
          name={RESPONSE_TEXTAREA_ID}
        ></textarea>
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={EMAIL_SUBJECT_INPUT_ID}
        >
          Object
          <button
            _={`
            on click
              set text to #${EMAIL_SUBJECT_INPUT_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <input
          class="fr-input"
          type="text"
          id={EMAIL_SUBJECT_INPUT_ID}
          name={EMAIL_SUBJECT_INPUT_ID}
          value={`[MonComptePro] Demande pour rejoindre ${moderation.organizations.cached_libelle}»`}
        />
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={EMAIL_TO_INPUT_ID}
        >
          Destinataire
          <button
            _={`
            on click
              set text to #${EMAIL_TO_INPUT_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <input
          class="fr-input"
          type="text"
          readonly={true}
          id={EMAIL_TO_INPUT_ID}
          name={EMAIL_TO_INPUT_ID}
          value={moderation.users.email}
        />
      </div>
      {moderation.ticket_id ? (
        <form
          class="text-right"
          hx-put={
            app_hc.legacy.moderations[":id"].email.$url({
              param: { id: moderation.id.toString() },
            }).pathname
          }
          hx-include={hx_include([
            EMAIL_SUBJECT_INPUT_ID,
            RESPONSE_TEXTAREA_ID,
          ])}
          hx-swap="none"
        >
          <button
            _={`
          on click
            wait for ${Htmx_Events.Enum["htmx:afterSwap"]} from body
            go to the top of .last-message smoothly
          `}
            type="submit"
            class={button()}
          >
            <span>Envoyer une réponse via Zammad</span>
          </button>
          <div></div>
          <div>
            <Loader htmx_indicator={true} />
          </div>
        </form>
      ) : (
        <div class="m-auto my-12 w-fit">
          <a
            href={`https://support.etalab.gouv.fr/#search/${moderation.users.email}`}
          >
            Trouver l'email correspondant dans Zammad
          </a>
        </div>
      )}

      <hr />
    </div>
  );
}

//

const reponse_templates: Array<{
  label: string;
  template: (options: {
    moderation: Moderation & { organizations: Organization; users: User };
  }) => string;
}> = [
  {
    label: "nom et prénom et job",
    template({ moderation }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Les comptes MonComptePro doivent être associés à une personne physique. Merci de renseigner correctement vos nom, prénom ainsi que votre fonction.

        Pour se faire :

        - connectez vous à https://app.moncomptepro.beta.gouv.fr/
        - cliquez sur le lien suivant https://app.moncomptepro.beta.gouv.fr/users/personal-information
        - corrigez vos informations
        - sélectionnez votre organisation (numéro SIRET : ${moderation.organizations.siret})

        Je reste à votre disposition pour tout complément d'information.

        Excellente journée,
        L’équipe MonComptePro.
      `;
    },
  },
  {
    label: "Quel lien avec l'organisation ?",
    template({ moderation }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Afin de donner suite à cette demande, pourriez vous nous préciser le lien que vous avez avec cette organisation ?

        Nous vous recommandons de demander directement à l'organisation que vous représentez d'effectuer la démarche.

        Excellente journée,
        L’équipe MonComptePro.
      `;
    },
  },
  {
    label: "Merci d'utiliser votre adresse email professionnelle",
    template({ moderation }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Afin de donner suite à votre demande, merci d'effectuer votre inscription avec votre adresse mail professionnelle.

        Je reste à votre disposition pour tout complément d'information.

        Excellente journée,
        L’équipe MonComptePro.
      `;
    },
  },
  {
    label: "Merci d'utiliser votre adresse officielle de contact",
    template({ moderation }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Afin de donner suite à votre demande, merci d'effectuer votre inscription avec votre email officiel de contact ADRESSE, tel que déclaré sur LIEN

        Je reste à votre disposition pour tout complément d'information.

        Excellente journée,
        L’équipe MonComptePro.
      `;
    },
  },
  {
    label: "Vous possédez déjà un compte MonComptePro",
    template({ moderation }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Vous possédez déjà un compte MonComptePro :

        - ${moderation.users.email}

        Merci de bien vouloir vous connecter avec le compte déjà existant.

        Je reste à votre disposition pour tout complément d'information.

        Excellente journée,
        L’équipe MonComptePro.
      `;
    },
  },
  {
    label: "Quel lien avec le Ministère de l'Éduc Nat",
    template({ moderation }) {
      return dedent`
      Bonjour,

      Votre demande pour rejoindre l'organisation « ${
        moderation.organizations.cached_libelle
      } » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

      Afin de donner suite à cette demande, pourriez vous nous préciser le lien que vous avez avec cette organisation ? Votre adresse mail correspond au rectorat ${
        moderation.users.email.split("@")[1]
      }. Merci de bien vouloir rejoindre ce dernier ou utiliser une adresse mail dont le nom de domaine est : education.gouv.fr

      Nous vous recommandons de demander directement à l'organisation que vous représentez d'effectuer la démarche.

      Excellente journée,
      `;
    },
  },
];

function ResponseMessageSelector({
  moderation,
}: {
  moderation: Moderation & { organizations: Organization; users: User };
}) {
  return (
    <select
      _={`
      on change
        set #${RESPONSE_TEXTAREA_ID}.value to my value
      `}
      class="fr-select"
      id={RESPONSE_MESSAGE_SELECT_ID}
      name={RESPONSE_MESSAGE_SELECT_ID}
    >
      <option value="" selected disabled hidden>
        Sélectionner une response
      </option>
      {reponse_templates.map(({ label, template }) => (
        <option value={template({ moderation })}>{label}</option>
      ))}
    </select>
  );
}

function SendModerationProcessedEmail({
  moderation,
}: {
  moderation: Moderation;
}) {
  const disabled =
    moderation.type !== "organization_join_block" &&
    moderation.type !== "ask_for_sponsorship";
  return (
    <form
      class="m-auto my-12 w-fit"
      hx-patch={
        app_hc.legacy.moderations[":id"].processed.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        on click
          wait for ${Htmx_Events.Enum["htmx:afterOnLoad"]} from body
          go to the top of body
          wait 1s
          set the window's location to "/legacy"
        `}
        class={button({ intent: "dark" })}
        disabled={disabled}
      >
        🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »
      </button>
    </form>
  );
}

function MarkModerationProcessed({ moderation }: { moderation: Moderation }) {
  if (moderation.moderated_at)
    return (
      <button class={button({ intent: "dark" })} disabled={true}>
        Cette modération a été marqué comme traitée le{" "}
        <b>{date_to_string(moderation.moderated_at)}</b>.
      </button>
    );

  return (
    <form
      class="m-auto my-12 w-fit"
      hx-patch={
        app_hc.legacy.moderations[":id"].processed.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        on click
          wait for ${Htmx_Events.Enum["htmx:afterOnLoad"]} from body
          go to the top of body
          wait 1s
          set the window's location to "/legacy"
        `}
        class={button({ intent: "dark" })}
      >
        🪄 Marquer comme traité
      </button>
    </form>
  );
}

export async function ListZammadArticles({
  moderation,
}: {
  moderation: Moderation & { users: User };
}) {
  if (!moderation.ticket_id) {
    return (
      <div class="m-auto my-12 w-fit">
        <a
          href={`https://support.etalab.gouv.fr/#search/${moderation.users.email}`}
        >
          Trouver l'email correspondant dans Zammad
        </a>
      </div>
    );
  }

  const articles = await get_zammad_mail({ ticket_id: moderation.ticket_id });
  const show_more = articles.length > MAX_ARTICLE_COUNT;
  const displayed_articles = articles.slice(-MAX_ARTICLE_COUNT);

  return (
    <section>
      <h5 class="flex flex-row justify-between">
        <span>{articles.at(0)?.subject}</span>
        <OpenInZammad ticket_id={moderation.ticket_id} />
      </h5>
      <ul class="list-none">
        {show_more ? (
          <li class="my-12 text-center">
            <ShowMoreCallout ticket_id={moderation.ticket_id}></ShowMoreCallout>
          </li>
        ) : (
          <></>
        )}
        {displayed_articles.map((article, index) => (
          <li
            class={
              index === displayed_articles.length - 1 ? "last-message" : ""
            }
            id={`${article.id}`}
          >
            <p class="text-center text-sm font-bold">
              <time datetime={article.created_at} title={article.created_at}>
                {date_to_string(new Date(article.created_at))}
              </time>
            </p>
            <Message article={article} moderation={moderation} />
            <hr />
          </li>
        ))}
        <li>
          <hr />
        </li>
      </ul>
    </section>
  );
}

function ShowMoreCallout({ ticket_id }: { ticket_id: number }) {
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {MAX_ARTICLE_COUNT} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Zammad{" "}
        <OpenInZammad ticket_id={ticket_id} />
      </p>
    </div>
  );
}
ShowMoreCallout.Title = createSlot();
ShowMoreCallout.Text = createSlot();

function OpenInZammad({ ticket_id }: { ticket_id: number }) {
  return (
    <a
      href={`${env.ZAMMAD_URL}/#ticket/zoom/${ticket_id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      #{ticket_id}
    </a>
  );
}
