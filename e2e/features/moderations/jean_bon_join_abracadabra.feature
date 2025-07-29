#language: fr
Fonctionnalité: Moderation blockante à accepter

  Contexte: Jean Bon veut rejoindre l'organisation « Abracadabra »
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je réinitialise le contexte
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Alors je vois "Bon"
    Et je vois "Jean"  
    Et je vois "jeanbon@yopmail.com"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l’adresse jeanbon@yopmail.com"

    Quand je clique sur "🌐 1 domaine connu dans l'organisation"

  Scénario: Domaine interne
    Soit le tableau sous le title "🌐 1 domaine connu dans l'organisation"
    Et je vois la ligne "yopmail.com" dans le tableau
    Et sur la même ligne je vois "❓"
    Et sur la même ligne je vois "Menu"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "✅ Domaine autorisé"
    Alors je vois la ligne "yopmail.com" dans le tableau
    Alors sur la même ligne je vois "✅"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur le bouton "🚫 Domaine refusé"
    Alors sur la même ligne je vois "🚫"
    Alors sur la même ligne je vois "refused"

    Quand je clique sur le champs dans le tableau
    Et je tape "poymail.com"
    Et je clique sur "Ajouter" dans le tableau

    Alors je vois la ligne "poymail.com" dans le tableau
    Alors sur la même ligne je vois "✅"

  Scénario: Domaine externe
    Soit le tableau sous le title "🌐 1 domaine connu dans l'organisation"
    Et je vois la ligne "yopmail.com" dans le tableau
    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur le bouton "❎ Domaine externe"
    Alors sur la même ligne je vois "❎"

  Scénario: Le modérateur le valide avec la barre d'outils
    Quand je clique sur "✅ Accepter"
    Alors je vois "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra, je valide :"

    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte
    Et je vois "Cette modération a été marqué comme traitée le"
    Et je vois "Validé par user@yopmail.com"

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "51935970700022"

    Alors une notification mail est envoyée
