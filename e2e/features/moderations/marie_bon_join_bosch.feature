#language: fr

#

Fonctionnalité: Moderation non blockante

  Contexte: Marie Bon veut rejoindre l'organisation Dengi - Leclerc
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"

    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

    Alors je vois "Liste des moderations"
    * je vois la ligne de table "57206768400017"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Marie"
    * sur la même ligne je vois "marie.bon@fr.bosch.com"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l’adresse marie.bon@fr.bosch.com"

  Scénario: Le nom de domaine est vérifié
    Soit le tableau "Domain internes" vide
    Quand je clique sur "Je valide ce membre ✅"
    Quand je clique sur "J’autorise le domaine fr.bosch.com pour toute l’organisation"
    Quand je clique sur "Notifier le membre et terminer"
    Alors je vois la ligne "fr.bosch.com" dans le table "Domain internes"

  Scénario: Marie est un membre interne de l'organization.
    Soit le tableau sous le title "Membres connus dans l’organisation" vide
    Quand je clique sur "Je valide ce membre ✅"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'INTERNE"
    Quand je clique sur "Notifier le membre et terminer"

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    * je vois la ligne de table "57206768400017"
    Quand sur la même ligne je clique sur "✅"

    Soit le tableau sous le title "Membres connus dans l’organisation"
    Alors je vois "fr.bosch.com" dans le tableau de "Membres connus dans l’organisation"
    Et je vois "✅" dans le tableau de "Membres connus dans l’organisation"

  Scénario: Marie est un membre externe de l'organization.
    Soit le tableau sous le title "Membres connus dans l’organisation" vide
    Quand je clique sur "Je valide ce membre ✅"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'EXTERNE"
    Quand je clique sur "Notifier le membre et terminer"

    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    * je vois la ligne de table "57206768400017"
    Quand sur la même ligne je clique sur "✅"

    Soit le tableau sous le title "Membres connus dans l’organisation"
    Alors je vois "fr.bosch.com" dans le tableau de "Membres connus dans l’organisation"
    Et je vois "❌" dans le tableau de "Membres connus dans l’organisation"
