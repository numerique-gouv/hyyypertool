#language: fr

#

Fonctionnalité: Duplicate Moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Richard Bon veut rejoindre l'organisation Dengi - Leclerc
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "38514019900014"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Richard"
    * sur la même ligne je vois "richardbon@leclerc.fr"

  # Scénario:
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Richard Bon a rejoint l'organisation de plus de 50 employés « Dengi - Leclerc »"

    Alors je vois "Attention : demande multiples"
    * je vois "Il s'agit de la 2e demande pour cette organisation"

    Alors je vois "✔️: Pas de ticket"
    * je vois "❌: Pas de ticket"
