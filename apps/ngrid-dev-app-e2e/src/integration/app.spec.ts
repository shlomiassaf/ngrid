describe('ngrid-dev-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h1').contains('NGrid Demos');
  });
});
