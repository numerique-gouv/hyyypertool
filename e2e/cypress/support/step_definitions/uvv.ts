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

/**
 * Sets the current context for domain-specific step definitions
 */
export const set_within_context = (
  context: () => Cypress.Chainable<JQuery<HTMLElement>>,
) => {
  get_within_context = context;
};

Before(() => {
  get_within_context = () => cy.get("body");
});

// Context management
Given("je vais à l'intérieur du dialogue nommé {string}", (text: string) => {
  get_within_context = () => cy.findAllByLabelText(text);
});

Given("je vais à l'intérieur du tableau {string}", (title: string) => {
  cy.contains(title)
    .invoke("attr", "id")
    .then((id) => {
      get_within_context = () => cy.get(`[aria-describedby="${id}"]`);
    });
});

Given("je vais à l'intérieur de la rangée nommée {string}", (name: string) => {
  get_within_context = () => cy.get(`tr[aria-label="${name}"]`);
});

// Navigation
Given("je suis sur la page {string}", (path: string) => {
  cy.visit(path);
});

Given("je navigue sur la page", () => {
  cy.visit("/");
});

// Actions

When("je réinitialise le contexte", () => {
  get_within_context = () => cy.get("body");
});

When("je clique sur {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).click());
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("je clique sur le bouton nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("button", text).click());
});

When("je clique sur le lien nommé {string}", (text: string) => {
  get_within_context().within(() => cy.contains("a", text).click());
});

When(
  "je saisie {string} dans le champ nommé {string}",
  (text: string, name: string) => {
    get_within_context().within(() => cy.findByLabelText(name).type(text));
  },
);

When(
  "je saisie le mot {string} dans la boîte à texte nommée {string}",
  (text: string, name: string) => {
    get_within_context().within(() =>
      cy.get(`input[placeholder="${name}"]`).type(text),
    );
  },
);

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});

When("je retire le focus", () => {
  cy.focused().blur();
});

// Assertions
Then("je vois {string}", (text: string) => {
  get_within_context().within(() => {
    cy.contains(text, { timeout: 8000 }).should("be.visible");
  });
});

Then("je dois voir le texte {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("be.visible"));
});

Then("je ne vois pas {string}", (text: string) => {
  get_within_context().within(() => cy.contains(text).should("not.exist"));
});

Then("je suis redirigé vers {string}", (path: string) => {
  cy.url().should("contain", path);
});

Then("je suis redirigé sur {string}", (path: string) => {
  cy.url().should("contain", path);
});

Then("je ne vois aucun élément", () => {
  get_within_context().within(() =>
    cy.get("tbody > tr, .empty-state, [data-empty]").should("have.length", 0),
  );
});

Then("je vois {int} éléments", (count: number) => {
  get_within_context().within(() =>
    cy.get("tbody > tr, [data-item], .list-item").should("have.length", count),
  );
});
