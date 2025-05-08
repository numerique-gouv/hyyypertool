#language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: Connexion de user@yopmail.com
    Etant donné que je navigue sur la page
    Alors je dois voir un élément qui contient "Bonjour Hyyypertool !"
    Quand je clique sur le bouton nommé "ProConnect"

    Alors je suis redirigé sur "/moderations"
    Et je dois voir un élément qui contient "Jean User"
    Et je dois voir un élément qui contient "Hyyypertool"

    Quand je clique sur le lien nommé "Utilisateurs"
    Alors je suis redirigé sur "/users"
    Et je dois voir un élément qui contient "Liste des utilisateurs"

    Quand je clique sur le lien nommé "Organisations"
    Alors je suis redirigé sur "/organizations"
    Et je dois voir un élément qui contient "Liste des organisations"

    Quand je clique sur le lien nommé "Moderations"
    Alors je suis redirigé sur "/moderations"
    Et je dois voir un élément qui contient "Liste des moderations"
