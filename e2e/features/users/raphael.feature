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
    Et je dois voir le titre de page "Liste des utilisateurs"
    Et je vois "Liste des utilisateurs"
    Quand je vais à l'intérieur de la rangée nommée "Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "👨‍💻 A propos de l'utilisateur"
    Et je vois "« Raphael Dubigny »"
    Et je vois "email rdubigny@beta.gouv.fr"
    Et je vois "prénomRaphael"
    Et je vois "nomDubigny"
    Et je vois "téléphone0123456789"
    Et je vois "Création13/07/2018 17:35:15"
    Et je vois "Dernière modification22/06/2023 16:34:34"
    Et je vois "Email vérifié envoyé le22/06/2023 16:34:34"

  # Scénario: Organisations de Raphael
    Alors je vois "Raphael est enregistré(e) dans les organisations suivantes "
    Et je vois "DINUM"
    Et je vois "13002526500013"
