#language: fr
Fonctionnalité: Moderation blockante à accepter

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Jean Bon veut rejoindre l'organisation « Abracadabra »
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "51935970700022"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Jean"
    * sur la même ligne je vois "jeanbon@yopmail.com"

  # Scénario: Fiche de DINUM
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l’adresse jeanbon@yopmail.com"

    Quand je clique sur le bouton "🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »"
    Alors je vois "Modération traitée"
    * je vois "Cette modération a été marqué comme traitée le"

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "51935970700022"

