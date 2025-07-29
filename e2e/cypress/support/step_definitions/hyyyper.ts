//
// Sentence description heavily inspired by UVV
// https://e2e-test-quest.github.io/uuv/fr/docs/wordings/generated-wording-description/fr-generated-wording-description/
//

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import "@testing-library/cypress/add-commands";
import { get_within_context, set_within_context } from "./uvv.js";

//

let target: JQuery<HTMLElement>;
let table_scope: string;
let row_scope: string;

//

// Navigation steps moved to uvv.ts

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

Given("le tableau sous le title {string}", function (text: string) {
  cy.contains(text)
    .invoke("attr", "id")
    .then((id) => {
      cy.get(`[aria-describedby="${id}"]`).as(`${text}-table`);
    });
  table_scope = `@${text}-table`;
});

Given("le tableau est vide", function (text: string) {
  cy.get(table_scope).within(() =>
    cy.get("tbody > tr").should("have.length", 0),
  );
});

//

// Basic visibility checks moved to uvv.ts

Then("je vois {string} dans le tableau", function (text: string) {
  cy.get(table_scope).contains(text);
});

Then("je ne vois pas {string} dans le tableau", function (text: string) {
  cy.get(table_scope).contains(text).should("not.exist");
});

Then("je vois {int} lignes dans le tableau", function (count: number) {
  cy.get(table_scope).find("tbody > tr").should("have.length", count);
});

Then(
  "je vois {string} dans le tableau {string}",
  function (text: string, context: string) {
    cy.contains(context).parents("table").contains(text);
  },
);

// Negative visibility checks moved to uvv.ts

Then(
  "je vois la ligne {string} dans le table {string}",
  function (text: string, context: string) {
    cy.contains(context).parents("table").contains("td", text);
  },
);

Then("je vois la ligne {string} dans le tableau", function (text: string) {
  cy.get(table_scope).contains("td", text).parent("tr").as(`${text}-row`);
  row_scope = `@${text}-row`;
});

Then("je vois la ligne de table {string}", function (text: string) {
  cy.contains("td", text).parent("tr").as(`${text}-row`);
  row_scope = `@${text}-row`;
});

Then("sur la même ligne je vois {string}", function (text: string) {
  cy.get(row_scope).contains(text);
});

Then("sur la ligne suivante je vois {string}", function (text: string) {
  cy.get(row_scope)
    .then((row) => cy.wrap(row).next().contains(text).parent())
    .as(`${text}-row`);
  row_scope = `@${text}-row`;
});

//

// Basic click steps moved to uvv.ts

// Button click step moved to uvv.ts

When("j'ouvre le menu déroulant sur la même ligne", () => {
  cy.get(row_scope).contains("button", "Menu").click();
});

When("je clique sur {string} dans le tableau", function (text: string) {
  cy.get(table_scope).contains(text).click();
});

When("je clique sur le champs dans le tableau", () => {
  cy.get(table_scope).within(() => {
    cy.get("input").click();
  });
});

//

When("sur la même ligne je clique sur {string}", function (text: string) {
  cy.get(row_scope).contains(text).click();
});

// Redirection steps moved to uvv.ts

//

// Type step moved to uvv.ts

// Input steps moved to uvv.ts
Then(
  "je dois voir une boîte à texte nommée {string} et contenant {string}",
  (name: string, text: string) => {
    cy.findByLabelText(name).should("have.value", text);
  },
);
Then(
  "je dois voir une boîte à texte nommée {string} et contenant:",
  (name: string, text: string) => {
    cy.findByLabelText(name).should("contain", text);
  },
);

// Focus step moved to uvv.ts

When("je reviens en avant", () => {
  cy.go(1);
});

//
// Domain-specific step definitions for Hyyypertool
//

// Enhanced table interactions (project-specific)
Given("je consulte la ligne contenant {string}", (text: string) => {
  cy.contains("td", text).parent("tr").as("current-row");
});

When("sur la ligne sélectionnée je clique sur {string}", (text: string) => {
  cy.get("@current-row").contains(text).click();
});

Then("sur la ligne sélectionnée je vois {string}", (text: string) => {
  cy.get("@current-row").contains(text).should("be.visible");
});

When("je consulte le tableau {string}", (title: string) => {
  cy.contains(title)
    .invoke("attr", "id")
    .then((id) => {
      cy.get(`[aria-describedby="${id}"]`).as("current-table");
    });
});

Then("le tableau sélectionné est vide", () => {
  cy.get("@current-table").within(() =>
    cy.get("tbody > tr").should("have.length", 0),
  );
});

Then("je vois {int} lignes dans le tableau sélectionné", (count: number) => {
  cy.get("@current-table").find("tbody > tr").should("have.length", count);
});

When("dans le tableau sélectionné je clique sur {string}", (text: string) => {
  cy.get("@current-table").contains(text).click();
});

// Modal/Dialog interactions (application-specific)
When("j'ouvre le dialogue {string}", (title: string) => {
  cy.findAllByLabelText(title).as("current-dialog");
  set_within_context(() => cy.get("@current-dialog"));
});

When("je ferme le dialogue", () => {
  set_within_context(() => cy.get("body"));
});

When("je confirme l'action via le dialogue", () => {
  get_within_context().within(() => {
    cy.contains("button", /Confirmer|Valider|OK|Oui/).click();
  });
});

When("j'annule l'action via le dialogue", () => {
  get_within_context().within(() => {
    cy.contains("button", /Annuler|Non|Fermer/).click();
  });
});
