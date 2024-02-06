//

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

//

Given("je navigue sur la page", () => {
  cy.visit("/");
});

When("je clique sur {string}", (text: string) => {
  cy.contains(text).click();
});
When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});

Then("je vois {string}", function (text: string) {
  cy.contains(text);
});

//

When(
  "je me connecte en tant que {string} sur dev-agentconnect.fr",
  (email: string) => {
    cy.origin("https://fca.integ01.dev-agentconnect.fr", () => {
      cy.get("#email-input").type(email);
      cy.contains("button", "Se connecter").click();
    });
    cy.origin("https://app-test.moncomptepro.beta.gouv.fr", () => {
      cy.get('[name="password"]').type(email);
      cy.contains("button", "S’identifier").click();
      cy.contains("button", "Continuer").click();
    });
  },
);
