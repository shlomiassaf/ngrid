// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    nGrid(): Chainable<import('./ngrid-harness/ngrid-harness').NGridHarness>;
  }
}
