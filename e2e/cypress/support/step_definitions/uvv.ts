//
// Sentence description heavily inspired by UVV
// https://e2e-test-quest.github.io/uuv/fr/docs/wordings/generated-wording-description/fr-generated-wording-description/
//

import {
  Before,
  Given,
  Then,
  When,
} from "@badeball/cypress-cucumber-preprocessor";
import "@testing-library/cypress/add-commands";

//

/**
 * Returns the current context to scope all subsequent cy commands within this element.
 * Useful when working within a particular group of elements such as a <form>.
 * Similar to uuvGetContext(): Cypress.Chainable<Context>
 */
export let get_within_context: () => Cypress.Chainable<JQuery<HTMLElement>>;

Before(() => {
  get_within_context = () => cy.get("body");
});

//

Given("je vais à l'intérieur du dialogue nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je vais à l'intérieur de la section nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je reinitialise le contexte", () => {
  get_within_context = () => cy.get("body");
});

//

When("je clique sur le bouton nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("button", text).click());
});

When("je clique sur le lien nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("a", text).click());
});

//

Then("je dois voir un élément qui contient {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("be.visible"));
});

Then("je dois voir le texte {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("be.visible"));
});

Then("je ne dois pas voir le texte {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("not.exist"));
});

Then("je vois le texte {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("be.visible"));
});

//

When("je saisie {string} dans le champ nommé {string}", (text: string, name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).type(text));
});

When("je clique sur l'élément contenant {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).click());
});

//

Given("je suis sur la page {string}", (path: string) => {
  cy.visit(path);
});

Given("je navigue sur la page", () => {
  cy.visit("/");
});

When("je suis redirigé vers {string}", (path: string) => {
  cy.url().should("contain", path);
});

//

When("je sélectionne {string} dans la liste déroulante nommée {string}", (option: string, name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).select(option));
});

When("je coche la case nommée {string}", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).check());
});

When("je décoche la case nommée {string}", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).uncheck());
});

//

Then("je dois voir un bouton nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("button", text).should("be.visible"));
});

Then("je dois voir un lien nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("a", text).should("be.visible"));
});

Then("je dois voir un champ nommé {string}", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).should("be.visible"));
});

Then("le champ nommé {string} doit contenir {string}", (name: string, value: string) => {
  get_within_context().within(() => cy.findByLabelText(name).should("have.value", value));
});

Then("le champ nommé {string} doit être vide", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).should("have.value", ""));
});

Then("le champ nommé {string} doit être désactivé", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).should("be.disabled"));
});

Then("le champ nommé {string} doit être activé", (name: string) => {
  get_within_context().within(() => cy.findByLabelText(name).should("be.enabled"));
});

//

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click({ force: true });
});

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});

When("je retire le focus", () => {
  cy.focused().blur();
});
