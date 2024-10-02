#language: fr
Fonctionnalité: Moderation blockante à refuser

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"

  Scénario: Jean Bon veut rejoindre la DINUM
    Alors je vois "Liste des moderations"

    Quand je clique sur "Filtrer par jours"
    * je tape "2011-11-11"
    * je retire le focus

    Alors je vois la ligne de table "13002526500013"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Jean"
    * sur la même ligne je vois "jeanbon@yopmail.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Jean Bon veut rejoindre l'organisation « DINUM » avec l’adresse jeanbon@yopmail.com"

    # Quand je clique sur "Sélectionner une response"
    # * je sélectionne "Quel lien avec l'organisation ?"
    # * je clique "🪄 Marquer comme traité"
