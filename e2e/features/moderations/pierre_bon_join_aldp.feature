#language: fr

#

Fonctionnalité: Association Moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Jean Bon veut rejoindre l'association ALDP
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "81797266400038"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Pierre"
    * sur la même ligne je vois "pierrebon@aldp-asso.fr"

  # Scénario: Fiche de DINUM
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Pierre Bon a rejoint l'organisation de plus de 50 employés « ALDP »"
    * je vois "Liste des dirigeants"

  # Scénario: Liste des dirigeants de ALDP
    Quand je clique sur "Liste des dirigeants"
    # Alors j'ai téléchargé le fichier "PJ_f28086a79d6f58143fb510496f4dbbd7.pdf"
