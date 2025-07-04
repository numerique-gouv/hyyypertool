#language: fr
Fonctionnalité: Moderation non blockante

  Contexte: Marie Bon veut rejoindre l'organisation Dengi - Leclerc
    Soit une base de données nourrie au grain
    * un server faut server "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    * je reinitialise le contexte
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"

    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

    Alors je vois "Liste des moderations"
    * je vois la ligne de table "57206768400017"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Marie"
    * sur la même ligne je vois "marie.bon@fr.bosch.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l’adresse marie.bon@fr.bosch.com"

  Scénario: Le nom de domaine est vérifié
    Quand je consulte le tableau "domaine connu dans l'organisation"
    * le tableau sélectionné est vide
    Quand j'accepte la demande d'adhésion
    Quand je clique sur "J’autorise le domaine fr.bosch.com en interne à l'organisation"
    Quand je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    * je vois la ligne de table "57206768400017"
    Quand sur la même ligne je clique sur "✅"

    Quand je consulte le tableau "domaine connu dans l'organisation"
    * je consulte la ligne contenant "fr.bosch.com"
    * sur la ligne sélectionnée je vois "✅"

  Scénario: Marie est un membre interne de l'organization.
    Soit le tableau sous le title "0 membre connu dans l’organisation"
    * le tableau est vide
    Quand j'accepte la demande d'adhésion
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'INTERNE"
    Quand je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    * je vois la ligne de table "57206768400017"
    Quand sur la même ligne je clique sur "✅"

    Soit le tableau sous le title "1 membre connu dans l’organisation"
    Alors je vois "fr.bosch.com" dans le tableau
    Et je vois "✅" dans le tableau

  Scénario: Marie est un membre externe de l'organization.
    Soit le tableau sous le title "0 membre connu dans l’organisation"
    * le tableau est vide

    Quand j'accepte la demande d'adhésion
    * je clique sur "Ajouter Marie à l'organisation EN TANT QU'EXTERNE"
    * je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    * je vois la ligne de table "57206768400017"
    * sur la même ligne je clique sur "✅"

    Soit le tableau sous le title "1 membre connu dans l’organisation"
    Alors je vois "fr.bosch.com" dans le tableau
    Et je vois "❌" dans le tableau
