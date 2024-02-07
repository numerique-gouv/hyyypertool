#language: fr
Fonctionnalité: Page utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "AgentConnect"
    Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Page de Raphael
    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé sur "/legacy/users"
    Et je vois "Liste des utilisateurs"
    Et je vois "Raphael"

    Quand je clique sur "➡️"
    Alors je vois "A propos de Raphael"
    Et je vois "prénom : Raphael"
    Et je vois "nom : Dubigny"
    Et je vois "téléphone : 0123456789"
    Et je vois "poste : Chef"
