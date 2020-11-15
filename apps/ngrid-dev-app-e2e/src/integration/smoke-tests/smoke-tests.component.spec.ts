describe('ngrid-dev-app', () => {
  beforeEach(() => cy.visit('/dev-app-smoke-tests'));

  it('smoke test - diff snapshot', () => {
    cy.matchImageSnapshot('smoke-test-1');
  });
});
