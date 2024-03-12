#language: fr

#

Fonctionnalité: Moderation non blockante

  Contexte: Marie Bon veut rejoindre l'organisation Dengi - Leclerc
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"

    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

    Alors je vois "Liste des moderations"
    * je vois la ligne de table "57206768400017"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Marie"
    * sur la même ligne je vois "marie.bon@fr.bosch.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l’adresse marie.bon@fr.bosch.com"

  Scénario: le nom de domaine est vérifié
    Soit le tableau "Domain internes" vide
    Quand je clique sur "🪄 Action en un click : fr.bosch.com est un domain intern vérifié ✅"
    Alors je vois la ligne "fr.bosch.com" dans le table "Domain internes"