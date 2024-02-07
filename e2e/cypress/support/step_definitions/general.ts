//

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

//

Given("je navigue sur la page", () => {
  cy.visit("/");
});

//

Then("je vois {string}", function (text: string) {
  cy.contains(text);
});

//

When("je clique sur {string}", (text: string) => {
  cy.contains(text).click();
});
When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});
