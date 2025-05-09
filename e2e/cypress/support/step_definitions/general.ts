//
import {
  Before,
  Given,
  Then,
  When,
} from "@badeball/cypress-cucumber-preprocessor";
import "@testing-library/cypress/add-commands";

//

let target: JQuery<HTMLElement>;
let table_scope: string;
let row_scope: string;
let get_within_context: () => Cypress.Chainable<JQuery<HTMLElement>>;

Before(() => {
  get_within_context = () => cy.get("body");
});

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

Then("je vois {string}", function (text: string) {
  cy.contains(text).should("be.visible");
});

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

Then("je ne vois pas {string}", function (text: string) {
  cy.contains(text).should("not.exist");
});

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

When("je clique sur {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).click());
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click({ force: true });
});

When("j'ouvre le menu déroulant sur la même ligne", () => {
  cy.get(row_scope).contains("button", "Menu").click();
});

When(
  "je clique sur {string} dans le tableau",
  function (text: string, context: string) {
    cy.get(table_scope).contains(text).click();
  },
);

When("je clique sur le champs dans le tableau", () => {
  cy.get(table_scope).within(() => {
    cy.get("input").click();
  });
});

//

When("sur la même ligne je clique sur {string}", function (text: string) {
  cy.get(row_scope).contains(text).click();
});

When("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});

//

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});

When(
  "je saisie le(s) mot(s) {string} dans la boîte à texte nommée {string}",
  (text: string, name: string) => {
    get_within_context().within(() =>
      cy.get(`input[placeholder="${name}"]`).type(text),
    );
  },
);
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

When("je retire le focus", () => {
  cy.focused().blur();
});

When("je reviens en avant", () => {
  cy.go(1);
});

Given("je vais à l'intérieur du dialogue nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je vais à l'intérieur de la section nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je reinitialise le contexte", () => {
  get_within_context = () => cy.get("body");
});
