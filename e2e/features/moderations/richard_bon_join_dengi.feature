#language: fr

#

Fonctionnalité: Duplicate Moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"
    # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Richard Bon veut rejoindre l'organisation Dengi - Leclerc
    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Richard Bon pour 38514019900014"
    Alors je vois "Bon"
    Et je vois "Richard"
    Et je vois "richardbon@leclerc.fr"
    Et je clique sur "➡️"

    Et je dois voir le titre de page "Modération a traiter de Richard Bon pour 38514019900014"
    Et je réinitialise le contexte
    Alors je vois "Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »"

    Alors je vois "Attention : demande multiples"
    Et je vois "Il s'agit de la 2e demande pour cette organisation"

    Alors je vois "✔️: Pas de ticket"
    Et je vois "❌: Pas de ticket"
