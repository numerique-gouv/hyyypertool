#language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    * un server faut server "auth.agentconnect.gouv.fr"

  Scénario: Connexion de user@yopmail.com
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"

    Alors je suis redirigé vers "/moderations"
    Et je vois "Jean User"
    Et je vois "Hyyypertool"

    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé vers "/users"
    Et je vois "Liste des utilisateurs"

    Quand je clique sur "Organisations"
    Alors je suis redirigé vers "/organizations"
    Et je vois "Liste des organisations"

    Quand je clique sur "Moderations"
    Alors je suis redirigé vers "/moderations"
    Et je vois "Liste des moderations"
