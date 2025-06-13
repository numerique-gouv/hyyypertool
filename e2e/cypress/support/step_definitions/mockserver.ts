//

import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

// from https://app.swaggerhub.com/apis/jamesdbloom/mock-server-openapi/5.15.x#/Verification
type MockServerRequestVerificationBody = {
  httpRequest: {
    path: string;
  };
  times?: {
    atLeast?: number;
    atMost?: number;
  };
};

Given("un server faut server {string}", function (server: string) {
  cy.exec(`docker compose restart ${server}`);
  cy.exec(`docker compose up --wait ${server}`);
});

Then("une notification mail est envoyée", function () {
  cy.request(
    "PUT",
    new URL("/mockserver/verify", Cypress.env("APP_MONCOMPTEPRO_URL")).href,
    {
      httpRequest: {
        path: "/api/admin/send-moderation-processed-email",
      },
      times: {
        atLeast: 1,
      },
    } satisfies MockServerRequestVerificationBody,
  )
    .its("status")
    .should("equal", 202);
});

Then("une notification mail n'est pas envoyée", () => {
  cy.request({
    body: {
      httpRequest: {
        path: "/api/admin/send-moderation-processed-email",
      },
      times: {
        atLeast: 1,
      },
    },
    failOnStatusCode: false,
    method: "PUT",
    url: new URL("/mockserver/verify", Cypress.env("APP_MONCOMPTEPRO_URL"))
      .href,
  });
});
