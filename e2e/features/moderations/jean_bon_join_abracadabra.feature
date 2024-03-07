#language: fr
Fonctionnalité: Moderation blockante à accepter

  Contexte: Jean Bon veut rejoindre l'organisation « Abracadabra »
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  # Scénario: Jean Bon veut rejoindre l'organisation « Abracadabra »
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "51935970700022"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Jean"
    * sur la même ligne je vois "jeanbon@yopmail.com"
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l’adresse jeanbon@yopmail.com"

  Scénario: Domain internes
    Soit le tableau "Domain internes"
    Soit la ligne contenant "yopmail.com"
    * je vois la ligne de table "yopmail.com"
    * sur la même ligne je vois "❌"
    * sur la même ligne je vois "Menu"
    Quand j'ouvre le menu déroulant sur la même ligne
    * je vois "🗑️ Supprimer"
    * je vois "🔄 vérifié"

    Quand je clique sur "🔄 vérifié"
    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "✅"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🔄 vérifié"
    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "❌"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🗑️ Supprimer"
    Alors je ne vois pas "🔄 vérifié"

    Quand je clique sur le champs dans le tableau "Domain internes"
    * je tape "yopmail.com"
    * je clique sur "Add" dans le tableau "Domain internes"

    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "✅"


  Scénario: Domain externe
    Soit le tableau "Domain externe"
    Quand je clique sur le champs dans le tableau "Domain externe"
    * je tape "poymail.com"
    * je clique sur "Add" dans le tableau "Domain externe"
    Alors je vois la ligne de table "poymail.com"
    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🗑️ Supprimer"
    Alors je ne vois pas "poymail.com"

  Scénario: Envoyer l'email « Votre demande a été traitée »"
    Quand je clique sur le bouton "🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »"
    Alors je vois "Modération traitée"
    * je vois "Cette modération a été marqué comme traitée le"

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "51935970700022"
