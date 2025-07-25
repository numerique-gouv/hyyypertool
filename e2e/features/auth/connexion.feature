#language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    * un server faut server "auth.agentconnect.gouv.fr"

  Scénario: Connexion de user@yopmail.com
    Etant donné que je navigue sur la page
    Alors je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"

    # Quand je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

    Alors je suis redirigé sur "/moderations"
    Et je vois "Jean User"
    Et je vois "Hyyypertool"

    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé sur "/users"
    Et je vois "Liste des utilisateurs"

    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Et je vois "Liste des organisations"

    Quand je clique sur "Moderations"
    Alors je suis redirigé sur "/moderations"
    Et je vois "Liste des moderations"
