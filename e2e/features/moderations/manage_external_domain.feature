#language: fr
Fonctionnalité: Gérer un domaine externe lors de la modération

  Contexte: Jean Bon veut rejoindre l'organisation « Abracadabra »
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je réinitialise le contexte
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

    Et je dois voir le titre de page "Liste des moderations"
    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Alors je vois "Bon"
    Et je vois "Jean"
    Et je vois "jeanbon@yopmail.com"
    Et je clique sur "➡️"

    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je réinitialise le contexte
    Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l'adresse jeanbon@yopmail.com"

    Quand je clique sur "🌐 1 domaine connu dans l'organisation"

  Scénario: Domaine externe
    Quand je vais à l'intérieur du tableau nommé "🌐 1 domaine connu dans l'organisation"
    Alors je vois "yopmail.com"
    Et je réinitialise le contexte
    Quand je clique sur "Menu"
    Et je clique sur le bouton "❎ Domaine externe"
    Quand je vais à l'intérieur du tableau nommé "🌐 1 domaine connu dans l'organisation"
    Alors je vois "❎"