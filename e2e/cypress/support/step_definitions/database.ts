//

import { Given } from "@badeball/cypress-cucumber-preprocessor";

//

Given("une base de données nourrie au grain", () => {
  cy.log(" >>> SEED DATABASE <<<");
  cy.task("seed");
});
