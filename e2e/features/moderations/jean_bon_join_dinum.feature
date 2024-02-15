#language: fr
Fonctionnalité: Moderation blockante à refuser

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Jean Bon veut rejoindre la DINUM
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "13002526500013"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Jean"
    * sur la même ligne je vois "jeanbon@yopmail.com"

  # Scénario: Fiche de DINUM
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Jean Bon veut rejoindre l'organisation « DINUM » avec l’adresse jeanbon@yopmail.com"

    # * je clique "🪄 Marquer comme traité"
