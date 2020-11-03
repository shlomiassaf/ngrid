// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { NGridHarness } from './ngrid-harness';

Cypress.Commands.add('nGrid', { prevSubject: 'element' }, (subject: any, options: any = {}) => {
  if (subject.get().length > 1) throw new Error(`Selector "${subject.selector}" returned more than 1 grid instance.`)

  const nGrid: HTMLElement = subject.get()[0];
  if (nGrid.localName !== 'pbl-ngrid') {
    throw new Error(`Invalid nGrid element provided, got ${nGrid.tagName} but expected 'pbl-ngrid'`);
  }

  return new NGridHarness(nGrid) as any;
});
