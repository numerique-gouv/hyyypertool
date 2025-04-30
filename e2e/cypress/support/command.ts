//

declare global {
  namespace Cypress {
    interface Chainable {
      uuvGetContext: typeof uuvGetContext;
      uuvPatchContext: typeof uuvPatchContext;
    }
  }
}

//

const contextAlias = "context";
type Context = Cypress.Chainable<JQuery<HTMLElement>>;
//

function uuvGetContext(): Cypress.Chainable<Context> {
  return cy.get<Context>(`@${contextAlias}`);
}

export function uuvPatchContext(
  partOfContext: any,
): Cypress.Chainable<Context> {
  return cy.get<Context>(`@${contextAlias}`).then((context) => {
    cy.wrap({
      ...context,
      ...partOfContext,
    }).as(contextAlias);
  });
}
