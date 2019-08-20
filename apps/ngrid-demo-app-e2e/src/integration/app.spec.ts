import { getGreeting } from '../support/app.po';

describe('ngrid-demo-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('NGrid');
  });
});
