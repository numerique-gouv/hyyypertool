#language: fr
Fonctionnalité: Redirection après connexion

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "auth.agentconnect.gouv.fr"

  Scénario: Redirection vers la page d'origine après connexion depuis /users
    Quand je visite l'Url "/users"
    Alors je dois voir le titre de page "Accueil"
    Et je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"
    Alors je dois voir le titre de page "Liste des utilisateurs"
    Et je vois "Liste des utilisateurs"

  Scénario: Redirection vers la page d'origine après connexion depuis /organizations
    Quand je visite l'Url "/organizations"
    Alors je dois voir le titre de page "Accueil"
    Et je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"
    Alors je dois voir le titre de page "Liste des organisations"
    Et je vois "Liste des organisations"

  Scénario: Redirection vers la page d'origine après connexion depuis /moderations avec un ID
    Quand je visite l'Url "/moderations/42"
    Alors je dois voir le titre de page "Accueil"
    Et je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"
    Alors je dois voir le titre de page "Modération du utilisateur"

  Scénario: Pas de redirection quand on vient directement de la page d'accueil
    Quand je visite l'Url "/"
    Et je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"
    Alors je dois voir le titre de page "Liste des moderations"

