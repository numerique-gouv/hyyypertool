#language: fr
Fonctionnalité: Moderation blockante à refuser

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"

    Alors je vois "Liste des moderations"

    Quand je clique sur "Filtrer par jours"
    * je tape "2011-11-11"
    * je retire le focus

    Alors je vois la ligne de table "13002526500013"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Jean"
    * sur la même ligne je vois "jeanbon@yopmail.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Jean Bon veut rejoindre l'organisation « DINUM » avec l’adresse jeanbon@yopmail.com"

  Scénario: Le modérateur le refuse avec la barre d'outils
    Quand je clique sur "❌ Refuser"
    Alors je vois "Motif de refus pour jeanbon@yopmail.com (organisation : DINUM)"

    Soit je vais à l'intérieur du dialogue nommé "la modale de refus"
    Quand je saisie le mot "Nom de domaine introuvable{enter}" dans la boîte à texte nommée "Recherche d'une réponse type"
    * je clique sur "Notifier et terminer"
    Etant donné que je reinitialise le contexte
    Quand je reviens en avant
    Alors je vois "Cette modération a été marqué comme traitée le"
    * je vois "Rejeté par user@yopmail.com"
    * je vois 'Raison : "Nom de domaine introuvable"'

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"

    Quand je reviens en avant
    Alors je vois "Cette modération a été marqué comme traitée"


    Quand je clique sur "Commentaires"
    Alors je vois "Rejeté par user@yopmail.com"
    Alors je vois 'Raison : "Nom de domaine introuvable"'
