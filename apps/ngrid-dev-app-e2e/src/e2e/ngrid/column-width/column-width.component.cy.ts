describe('ngrid-dev-app', () => {
  beforeEach(() => cy.visit('/ngrid-column-width'));

  it('column width - diff snapshot', () => {
    cy.matchImageSnapshot('column-width.component');
  });
});
