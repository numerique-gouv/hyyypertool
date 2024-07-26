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

  @skip
  Scénario: Domaine interne
    Soit le tableau "Domain"
    Soit la ligne contenant "yopmail.com"
    * je vois la ligne de table "yopmail.com"
    * sur la même ligne je vois "❌"
    * sur la même ligne je vois "Menu"
    Quand j'ouvre le menu déroulant sur la même ligne
    * je vois "🗑️ Supprimer"
    * je vois "🔄 Domain vérifié"

    Quand je clique sur "🔄 Domain vérifié"
    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "✅"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🔄 Domain vérifié"
    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "❌"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🗑️ Supprimer"
    Alors je ne vois pas "🔄 Domain vérifié"

    Quand je clique sur le champs dans le tableau "Domain"
    * je tape "yopmail.com"
    * je clique sur "Add" dans le tableau "Domain"

    Alors je vois la ligne de table "yopmail.com"
    Alors sur la même ligne je vois "✅"


  @skip
  Scénario: Domaine externe
    Soit le tableau "Domain"
    Quand je clique sur le champs dans le tableau "Domain"
    * je tape "poymail.com"
    * je clique sur "Add" dans le tableau "Domain"
    Alors je vois la ligne de table "poymail.com"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "🔄 Domain externe"

    Alors je vois "🗑️ Supprimer" dans le tableau "Domain"
    Quand je clique sur "🗑️ Supprimer" dans le tableau "Domain"
    Alors je ne vois pas "poymail.com"

  Scénario: Envoyer l'email « Votre demande a été traitée »"
    Quand je clique sur "Je valide ce membre ✅"
    Et je clique sur "Terminer"
    * je vois "Cette modération a été marqué comme traitée le"

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "51935970700022"
