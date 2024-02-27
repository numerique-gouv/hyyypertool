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

Then("je ne vois pas {string}", function (text: string) {
  cy.contains(text).should("not.exist");
});

Then("je vois la ligne de table {string}", function (text: string) {
  cy.contains("td", text).parent().as("row");
});

Then("sur la même ligne je vois {string}", function (text: string) {
  cy.get("@row").contains(text);
});

//

When("je clique sur {string}", (text: string) => {
  cy.contains(text).click();
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("sur la même ligne je clique sur {string}", function (text: string) {
  cy.get("@row").contains(text).click();
});

When("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});
