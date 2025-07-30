#language: fr
# Contextes communs pour les tests de modération

Contexte: Base de modération
  Soit une base de données nourrie au grain
  Et un faux serveur "identite.proconnect.gouv.fr"
  Quand je navigue sur la page
  Et je réinitialise le contexte
  Et je vois "Bonjour Hyyypertool !"
  Et je clique sur le bouton "ProConnect"
  Et je dois voir le titre de page "Liste des moderations"
  Alors je vois "Liste des moderations"

Contexte: Navigation vers modération Jean Bon Abracadabra
  Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
  Alors je vois "Bon"
  Et je vois "Jean"
  Et je vois "jeanbon@yopmail.com"
  Et je clique sur "➡️"
  Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
  Et je réinitialise le contexte
  Alors je vois "Jean Bon veut rejoindre l'organisation « Abracadabra » avec l'adresse jeanbon@yopmail.com"

Contexte: Navigation vers modération Marie Bon Bosch
  Quand je vais à l'intérieur de la rangée nommée "Modération non vérifié de Marie Bon pour 57206768400017"
  Alors je vois "Bon"
  Et je vois "Marie"
  Et je vois "marie.bon@fr.bosch.com"
  Et je clique sur "➡️"
  Et je dois voir le titre de page "Modération non vérifié de Marie Bon pour 57206768400017"
  Et je réinitialise le contexte
  Alors je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Robert bosch france » avec l'adresse marie.bon@fr.bosch.com"