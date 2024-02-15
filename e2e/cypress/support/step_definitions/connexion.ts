//

import { When } from "@badeball/cypress-cucumber-preprocessor";

//

When(
  "je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr",
  (email: string) => {
    cy.origin("https://fca.integ01.dev-agentconnect.fr", () => {
      cy.get("#email-input").type("user@yopmail.com");
      cy.contains("button", "Se connecter").click();
    });
    cy.origin("https://app-test.moncomptepro.beta.gouv.fr", () => {
      cy.get('[name="password"]').type("user@yopmail.com");
      cy.contains("button", "S’identifier").click();
      cy.contains("button", "Continuer").click();
    });
  },
);
