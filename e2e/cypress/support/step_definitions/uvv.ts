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
