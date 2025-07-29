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
    Et je vois la ligne de table "38514019900014"
    Et sur la même ligne je vois "Bon"
    Et sur la même ligne je vois "Richard"
    Et sur la même ligne je vois "richardbon@leclerc.fr"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »"

    Alors je vois "Attention : demande multiples"
    Et je vois "Il s'agit de la 2e demande pour cette organisation"

    Alors je vois "✔️: Pas de ticket"
    Et je vois "❌: Pas de ticket"
