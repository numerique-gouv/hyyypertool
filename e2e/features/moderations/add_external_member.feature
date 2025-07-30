#language: fr
Fonctionnalité: Ajouter un membre externe lors de la modération

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

    Et je dois voir le titre de page "Modération non vérifié de Marie Bon pour 57206768400017"
    Et je réinitialise le contexte
    Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l'adresse marie.bon@fr.bosch.com"

  Scénario: Marie est un membre externe de l'organization.
    Alors je dois voir un tableau nommé "👥 0 membre connu dans l'organisation" et contenant
      | |

    Quand je clique sur "✅ Accepter"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'EXTERNE"
    Et je clique sur "Terminer"

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    Quand je vais à l'intérieur de la rangée nommée "Modération non vérifié de Marie Bon pour 57206768400017"
    Et je clique sur "✅"
    Et je réinitialise le contexte

    Alors je dois voir un tableau nommé "👥 1 membre connu dans l'organisation" et contenant
      | Prénom | Nom |
      | Marie  | Bon |