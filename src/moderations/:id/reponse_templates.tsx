import {
  type Moderation,
  type Organization,
  type User,
} from ":database:moncomptepro";
import { dedent } from "ts-dedent";

//
export const reponse_templates: Array<{
  label: string;
  template: (options: {
    moderation: Moderation & { organizations: Organization; users: User };
    members_email: string[];
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
    template({ moderation, members_email }) {
      return dedent`
        Bonjour,

        Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

        Vous possédez déjà un compte MonComptePro :

        - ${members_email.join("\n- ")}

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

      Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

      Afin de donner suite à cette demande, pourriez vous nous préciser le lien que vous avez avec cette organisation ? Votre adresse mail correspond au rectorat ${moderation.users.email.split("@")[1]}. Merci de bien vouloir rejoindre ce dernier ou utiliser une adresse mail dont le nom de domaine est : education.gouv.fr

      Nous vous recommandons de demander directement à l'organisation que vous représentez d'effectuer la démarche.

      Excellente journée,
      `;
    },
  },
  {
    label: "livreurs / mobilic",
    template({ moderation }) {
      return dedent`
      Bonjour,

      Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

      MonComptePro n'est pas dédié à votre démarche sur Mobilic.

      Si vous êtes salarié ou gestionnaire d'entreprise, cliquez sur le lien suivant pour vous connecter : [https://mobilic.beta.gouv.fr/login](https://mobilic.beta.gouv.fr/login)

      Excellente journée,
      `;
    },
  },
  {
    label: "refus prestataires",
    template({ moderation }) {
      return dedent`
      Bonjour,

      Votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

      Vous n'êtes pas autorisé à créer un compte au nom d'une organisation qui n'est pas la vôtre.

      Merci de bien vouloir demander à l'organisation d'effectuer elle-même la démarche ou de vous fournir une adresse mail dont le nom de domaine lui appartient.

      Excellente journée,
      `;
    },
  },
  {
    label: "refus comptable",
    template({ moderation }) {
      return dedent`
      Bonjour,

      Concernant votre demande pour rejoindre l'organisation « ${moderation.organizations.cached_libelle} » faites sur https://app.moncomptepro.beta.gouv.fr.
      La connexion à notre platforme est pour le moment restreinte aux seuls membres de l'organisation que vous souhaitez représenter.
      Nous vous prions de bien vouloir contacter directement l'organisation que vous représentez afin qu'elle effectue la démarche elle même.
      Nous vous remercions de votre compréhension et restons à votre disposition pour toute assistance complémentaire.

      Excellente journée
      `;
    },
  },
];
