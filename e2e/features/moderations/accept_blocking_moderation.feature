#language: fr
Fonctionnalité: Accepter une modération bloquante avec la barre d'outils

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Et je clique sur "➡️"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je réinitialise le contexte

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
