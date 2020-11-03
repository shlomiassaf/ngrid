import { NGridCypressHarness } from './ngrid-harness';

Cypress.Commands.add('nGrid', { prevSubject: 'element' }, (subject: any, options: any = {}) => {
  if (subject.get().length > 1) throw new Error(`Selector "${subject.selector}" returned more than 1 grid instance.`)

  const nGrid: HTMLElement = subject.get()[0];
  if (nGrid.localName !== 'pbl-ngrid') {
    throw new Error(`Invalid nGrid element provided, got ${nGrid.tagName} but expected 'pbl-ngrid'`);
  }

  return new NGridCypressHarness(nGrid) as any;
});
