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


  Scénario: Jean Bon ne peux pas rejoindre l'organisation DINUM
    Quand je clique sur "Je refuse ce membre ❌"
    Alors je vois "Motif de refus :"

    Soit je vais à l'intérieur de la section nommé "la section motif de refus"
    Quand je saisie le mot "Nom de domaine introuvable{enter}" dans la boîte à texte nommée "Recherche d'une réponse type"
    # Alors je dois voir une boîte à texte nommée "Message" et contenant:
    #   """
    #   Nous n'avons pas été en mesure de vérifier le nom de domaine de votre adresse mail
    #   """

    Quand je clique sur "Notifier le membre et terminer"
    * je reinitialise le contexte
    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"

    Quand je reviens en avant
    Alors je vois "Cette modération a été marqué comme traitée"

    Quand je clique sur "Commentaires"
    Alors je vois "Rejeté par user@yopmail.com"
    Alors je vois 'Raison : "Nom de domaine introuvable"'

  Scénario: Le modérateur le refuse avec la barre d'outils
    Quand je clique sur "❌ Refuser"
    Alors je vois "Vous refusez la demande de jeanbon@yopmail.com"

    Soit je vais à l'intérieur du dialogue nommé "la modale de refus"
    Quand je saisie le mot "Nom de domaine introuvable{enter}" dans la boîte à texte nommée "Recherche d'une réponse type"
    * je clique sur "Notifier le membre et terminer"
    Alors je vois "Cette modération a été marqué comme traitée le"
    * je vois "Rejeté par user@yopmail.com"
    * je vois 'Raison : "Nom de domaine introuvable"'

    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"
