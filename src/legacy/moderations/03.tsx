//

import {
  moncomptepro_pg,
  schema,
  type Moderation,
  type Organization,
  type User,
} from ":database:moncomptepro";
import { app_hc } from ":hc";
import { button } from ":ui/button";
import { eq } from "drizzle-orm";
import { ok } from "node:assert";
import { dedent } from "ts-dedent";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";

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

  const mailto_query = new URLSearchParams({
    subject: `[MonComptePro] Demande pour rejoindre ${moderation.organizations.cached_libelle}`,
    cc: `moncomptepro@beta.gouv.fr`,
  });

  return (
    <div class="mx-auto !max-w-6xl">
      <h1>
        ✉️ 3. J'ai pris ma décision, je copie le message que je souhaite
        répondre par mail
      </h1>

      <hr />

      <SendModerationProcessedEmail moderation={moderation} />

      <div class="fr-select-group">
        <label class="fr-label" for={RESPONSE_MESSAGE_SELECT_ID}>
          <h6>A) Copier le message à envoyer en réponse : </h6>
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

      <h6>B) Coller le texte en réponse à l'email correspondant :</h6>
      <a
        href={`mailto:${moderation.users.email}?${mailto_query}`}
        class={button()}
      >
        Envoyer un nouvel email
      </a>
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
      hx-patch={
        app_hc.legacy.moderations[":id"].processed.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button class={button({ intent: "dark" })} disabled={disabled}>
        🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »
      </button>
    </form>
  );
}
