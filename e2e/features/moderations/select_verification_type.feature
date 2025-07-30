#language: fr
Fonctionnalité: Sélectionner un type de vérification lors de l'acceptation

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
    Et je clique sur "✅ Accepter"

  Plan du Scénario: Sélectionner différents types de vérification
    Alors je vois "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra, je valide :"
    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Quand je clique sur "<type_verification>"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte
    Alors je vois "Cette modération a été marqué comme traitée le"
    Et je vois "Validé par user@yopmail.com"
    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les demandes traitées"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Et je clique sur "✅"
    Et je réinitialise le contexte
    Quand je clique sur "👥 1 membre connu dans l’organisation"
    Alors je dois voir un tableau nommé "👥 1 membre connu dans l’organisation" et contenant
      | Prénom | Nom  | Type               |
      | Jean   | Bon  | <verification_enum> |

    Exemples:
      | type_verification           | verification_enum         |
      | Mail officiel               | official_contact_email    |
      | Liste des dirigeants RNA    | in_liste_dirigeants_rna   |
      | Liste des dirigeants RNE    | in_liste_dirigeants_rne   |
      | Justificatif transmis       | proof_received            |
