#language: fr
Fonctionnalité: Refuser une modération bloquante

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je clique sur "Filtrer par jours"
    Et je tape "2011-11-11"
    Et je retire le focus
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 13002526500013"
    Et je clique sur "➡️"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 13002526500013"
    Et je réinitialise le contexte

  Scénario: Le modérateur le refuse avec la barre d'outils
    Quand je clique sur "❌ Refuser"
    Alors je vois "Motif de refus :"

    Soit je vais à l'intérieur du dialogue nommé "la modale de refus"
    Quand je saisie le mot "Nom de domaine introuvable{enter}" dans la boîte à texte nommée "Recherche d'une réponse type"
    Et je clique sur "Notifier et terminer"
    Quand je reviens en avant
    Et je réinitialise le contexte
    Alors je vois "Cette modération a été marqué comme traitée le"
    Et je vois "Rejeté par user@yopmail.com"
    Et je vois 'Raison : "Nom de domaine introuvable"'

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"

    Quand je reviens en avant
    Alors je vois "Cette modération a été marqué comme traitée"


    Quand je clique sur "Commentaires"
    Alors je vois "Rejeté par user@yopmail.com"
    Alors je vois 'Raison : "Nom de domaine introuvable"'
