#language: fr
Fonctionnalité: Moderation non blockante

  Contexte: Marie Bon veut rejoindre l'organisation Dengi - Leclerc
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je réinitialise le contexte
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

    # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération non vérifié de Marie Bon pour 57206768400017"
    Alors je vois "Bon"
    Et je vois "Marie"
    Et je vois "marie.bon@fr.bosch.com"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l’adresse marie.bon@fr.bosch.com"

  Scénario: Le nom de domaine est vérifié
    Soit le tableau sous le title "domaine connu dans l'organisation"
    Et le tableau est vide
    Quand je clique sur "✅ Accepter"
    Quand je clique sur "J’autorise le domaine fr.bosch.com en interne à l'organisation"
    Quand je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    Et je vois la ligne de table "57206768400017"
    Quand sur la même ligne je clique sur "✅"

    Soit le tableau sous le title "domaine connu dans l'organisation"
    Et je vois la ligne "fr.bosch.com" dans le tableau
    Et sur la même ligne je vois "✅"

  Scénario: Marie est un membre interne de l'organization.
    Soit le tableau sous le title "0 membre connu dans l’organisation"
    Et le tableau est vide
    Quand je clique sur "✅ Accepter"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'INTERNE"
    Quand je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    Quand je vais à l'intérieur de la rangée nommée "Modération non vérifié de Marie Bon pour 57206768400017"
    Et je clique sur "✅"
    Et je réinitialise le contexte

    Soit le tableau sous le title "1 membre connu dans l'organisation"
    Alors je vois "fr.bosch.com" dans le tableau
    Et je vois "✅" dans le tableau

  Scénario: Marie est un membre externe de l'organization.
    Soit le tableau sous le title "0 membre connu dans l’organisation"
    Et le tableau est vide

    Quand je clique sur "✅ Accepter"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'EXTERNE"
    Et je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    Quand je vais à l'intérieur de la rangée nommée "Modération non vérifié de Marie Bon pour 57206768400017"
    Et je clique sur "✅"
    Et je réinitialise le contexte

    Soit le tableau sous le title "1 membre connu dans l'organisation"
    Alors je vois "fr.bosch.com" dans le tableau
    Et je vois "❌" dans le tableau
