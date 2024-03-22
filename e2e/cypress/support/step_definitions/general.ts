//

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

//

let target: JQuery<HTMLElement>;
let scope: string;

//

Given("je navigue sur la page", () => {
  cy.visit("/");
});

Given("la ligne contenant {string}", (text) => {
  cy.contains("td", text)
    .parent()
    .then((row) => (target = row));
});

Given("la ligne précédente", () => {
  cy.wrap(target)
    .prev()
    .then((row) => (target = row));
});

Given("la ligne suivante", () => {
  cy.wrap(target)
    .next()
    .then((row) => (target = row));
});

Given("le tableau {string}", function (text: string) {
  cy.contains(text).parents("table").as(text);
  scope = `@${text}`;
});

Given("le tableau {string} vide", function (text: string) {
  cy.contains(text)
    .parents("table")
    .within(() => cy.get("tr").eq(0));
});

Given("le tableau sous le title {string}", function (text: string) {
  cy.contains(text)
    .invoke("attr", "id")
    .then((id) => {
      cy.get(`[aria-describedby="${id}"]`).as(`${text}-table`);
    });
});

Given("le tableau sous le title {string} vide", function (text: string) {
  cy.contains(text)
    .invoke("attr", "id")
    .then((id) => {
      cy.get(`[aria-describedby="${id}"]`)
        .as(`${text}-table`)
        .within(() => cy.get("tbody > tr").should("have.length", 0));
    });
});

//

Then("je vois {string}", function (text: string) {
  cy.contains(text);
});

Then(
  "je vois {string} dans le tableau {string}",
  function (text: string, context: string) {
    cy.contains(context).parents("table").contains(text);
  },
);

Then(
  "je vois {string} dans le tableau de {string}",
  function (text: string, context: string) {
    cy.get(`@${context}-table`).contains(text);
  },
);

Then("je ne vois pas {string}", function (text: string) {
  cy.contains(text).should("not.exist");
});

Then(
  "je vois la ligne {string} dans le table {string}",
  function (text: string, context: string) {
    cy.contains(context).parents("table").contains("td", text);
  },
);

Then("je vois la ligne de table {string}", function (text: string) {
  cy.contains("td", text).parent().as("row");
});

Then("sur la même ligne je vois {string}", function (text: string) {
  cy.get("@row").contains(text);
});

Then("sur la ligne suivante je vois {string}", function (text: string) {
  cy.get("@row")
    .then((row) => cy.wrap(row).next().contains(text).parent())
    .as("row");
});

//

When("je clique sur {string}", (text: string) => {
  cy.contains(text).click();
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("j'ouvre le menu déroulant sur la même ligne", (text: string) => {
  cy.get("@row").contains("button", "Menu").click();
});

When(
  "je clique sur {string} dans le tableau {string}",
  function (text: string, context: string) {
    cy.contains(context).parents("table").contains(text).click();
  },
);

When("je clique sur le champs dans le tableau {string}", (text: string) => {
  cy.contains(text)
    .parents("table")
    .within(() => {
      cy.get("input").click();
    });
});

//

When("sur la même ligne je clique sur {string}", function (text: string) {
  cy.get("@row").contains(text).click();
});

When("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});

//

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});

When("je retire le focus", () => {
  cy.focused().blur();
});
