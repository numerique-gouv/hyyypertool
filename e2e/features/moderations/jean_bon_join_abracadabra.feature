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

    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je réinitialise le contexte
    Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l’adresse jeanbon@yopmail.com"

    Quand je clique sur "🌐 1 domaine connu dans l’organisation"

  Scénario: Domaine interne
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status |
      | yopmail.com | ❓     |

    Quand je clique sur "Menu"
    Et je clique sur "✅ Domaine autorisé"
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status |
      | yopmail.com | ✅     |

    Quand je clique sur "Menu"
    Et je clique sur le bouton "🚫 Domaine refusé"
    Quand je vais à l'intérieur du tableau nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "🚫"
    Et je vois "refused"
    Et je réinitialise le contexte

    Quand je clique sur "Ajouter un domain"
    Et je tape "poymail.com{enter}"

    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status |
      | poymail.com| ✅  |

  Scénario: Domaine externe
    Quand je vais à l'intérieur du tableau nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "yopmail.com"
    Et je réinitialise le contexte
    Quand je clique sur "Menu"
    Et je clique sur le bouton "❎ Domaine externe"
    Quand je vais à l'intérieur du tableau nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "❎"

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
