/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    nGrid(): Chainable<import('./ngrid-harness/ngrid-harness').NGridCypressHarness>;
  }
}
