#language: fr
Fonctionnalité: Page utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
  # Scénario: Fiche de Raphael
    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé sur "/legacy/users"
    * je vois "Liste des utilisateurs"
    * je vois la ligne de table "Raphael"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "A propos de Raphael"
    * je vois "email : rdubigny@beta.gouv.fr"
    * je vois "prénom : Raphael"
    * je vois "nom : Dubigny"
    * je vois "téléphone : 0123456789"
    * je vois "Création : 13/07/2018 15:35:15"
    * je vois "Dernière modif :22/06/2023 14:34:34"
    * je vois "mail de vérif envoyé : 22/06/2023 14:34:34"

  # Scénario: Organisations de Raphael
    Alors je vois "Raphael est enregistré(e) dans les organisations suivantes "
    * je vois "DINUM"
    * je vois "13002526500013"
