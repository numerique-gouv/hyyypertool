#language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    * un server faut server "auth.agentconnect.gouv.fr"

  Scénario: Connexion de user@yopmail.com
    Etant donné que je suis sur la page "/"
    Alors je dois voir le texte "Bonjour Hyyypertool !"
    Quand je clique sur le bouton nommé "ProConnect"

    Alors je suis redirigé vers "/moderations"
    Et je dois voir le texte "Jean User"
    Et je dois voir le texte "Hyyypertool"

    Quand je clique sur le lien nommé "Utilisateurs"
    Alors je suis redirigé vers "/users"
    Et je dois voir le texte "Liste des utilisateurs"

    Quand je clique sur le lien nommé "Organisations"
    Alors je suis redirigé vers "/organizations"
    Et je dois voir le texte "Liste des organisations"

    Quand je clique sur le lien nommé "Moderations"
    Alors je suis redirigé vers "/moderations"
    Et je dois voir le texte "Liste des moderations"
