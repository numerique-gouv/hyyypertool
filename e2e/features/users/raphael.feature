#language: fr
Fonctionnalité: Page utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"
    # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
  # Scénario: Fiche de Raphael
    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé sur "/users"
    Et je vois "Liste des utilisateurs"
    Et je vois la ligne de table "Raphael"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "👨‍💻 A propos de l'utilisateur"
    Et je vois "« Raphael Dubigny »"
    Et je vois "email rdubigny@beta.gouv.fr"
    * je vois "prénomRaphael"
    * je vois "nomDubigny"
    * je vois "téléphone0123456789"
    * je vois "Création13/07/2018 15:35:15"
    * je vois "Dernière modification22/06/2023 14:34:34"
    * je vois "Email vérifié envoyé le22/06/2023 14:34:34"

  # Scénario: Organisations de Raphael
    Alors je vois "Raphael est enregistré(e) dans les organisations suivantes "
    * je vois "DINUM"
    * je vois "13002526500013"
