//
// Domain-specific step definitions for Hyyypertool
// Keep only steps that cannot be replaced by UVV generic patterns
//

import { When } from "@badeball/cypress-cucumber-preprocessor";
import "@testing-library/cypress/add-commands";

// Navigation helpers
When("je reviens en avant", () => {
  cy.go(1);
});
