#language: fr
Fonctionnalité: Page utilisateur with moderations

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
  # Scénario: Fiche de Raphael
    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé sur "/users"
    * je vois "Liste des utilisateurs"
    * je vois la ligne de table "jeanbon@yopmail.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "👨‍💻 A propos de l'utilisateur"
    * je vois "« Jean Bon »"
    * je vois "email jeanbon@yopmail.com"
    * je vois "prénomJean"
    * je vois "nomBon"
    * je vois "téléphone0123456789"
    * je vois "Création13/07/2018 15:35:15"
    * je vois "Dernière modification22/06/2023 14:34:34"
    * je vois "Email vérifié envoyé le22/06/2023 14:34:34"

  # Scénario: Organisations de Raphael
    Alors je vois "Jean est enregistré(e) dans les modérations suivantes :"
    * je vois la ligne de table "11/11/2011 11:11:11"
