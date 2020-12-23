describe('ngrid-docs-app', () => {
  beforeEach(() => cy.visit('/features/column/hide-column'));

  it('should hide and show columns', () => {
    cy.get('pbl-hide-columns-example-component > pbl-ngrid')
      .nGrid()
      .should( ngrid => {
        expect(ngrid.getColumns()).to.deep.eq(['id', 'name', 'gender', 'birthdate', 'email', 'language']);
        cy.get('pbl-hide-columns-example-component mat-select').click();
        cy.get('#mat-option-3 > .mat-option-text').click();
        cy.get('#mat-option-2 > .mat-option-text').click();
        cy.get('#mat-option-5 > .mat-option-text').click();
        cy.wait(100).should(() => {
          expect(ngrid.getColumns()).to.deep.eq(['id', 'name', 'language']);
        });

        cy.get('#mat-option-2 > .mat-option-text').click();
        cy.get('#mat-option-3 > .mat-option-text').click();
        cy.get('#mat-option-4 > .mat-option-text').click();
        cy.get('#mat-option-5 > .mat-option-text').click();
        cy.wait(100).should(() => {
          expect(ngrid.getColumns()).to.deep.eq(['id', 'name', 'gender', 'birthdate', 'bio', 'email', 'language']);
        });
        cy.get('.cdk-overlay-backdrop').click();
    });
  });

  it('should hide and show group columns when child columns hide/show', () => {
    cy.get('pbl-hide-columns-with-group-headers-example-component > pbl-ngrid')
      .nGrid()
      .should( ngrid => {
        expect(ngrid.getColumns()).to.deep.eq(['id', 'name', 'gender', 'birthdate', 'bio', 'email', 'country', 'language']);
        const headerRows = ngrid.getHeaderMetaRows();
        expect(headerRows.length).to.eq(1);
        const hr = headerRows[0];
        expect(hr.isGroup).to.eq(true);
        expect(hr.type).to.eq('fixed');
        expect(Number(hr.rowIndex)).to.eq(0);
        expect(hr.cells.length).to.eq(4);
        expect(hr.cells[0].placeholder).to.eq(true);
        expect(hr.cells[1].placeholder).to.eq(false);
        expect(hr.cells[2].placeholder).to.eq(true);
        expect(hr.cells[3].placeholder).to.eq(false);
        expect(hr.cells[1].id).to.eq('name-gender-birthdate');


        cy.get('pbl-hide-columns-with-group-headers-example-component mat-select').click();
        cy.get('span.mat-option-text').contains('name').then(option => option[0].click());
        cy.get('span.mat-option-text').contains('gender').then(option => option[0].click());
        cy.get('span.mat-option-text').contains('birthdate').then(option => option[0].click());
        cy.wait(100).should(() => {
          expect(ngrid.getColumns()).to.deep.eq(['id', 'bio', 'email', 'country', 'language']);

          const headerRows1 = ngrid.getHeaderMetaRows();
          expect(headerRows1.length).to.eq(1);
          const hr1 = headerRows1[0];
          expect(hr1.isGroup).to.eq(true);
          expect(hr1.type).to.eq('fixed');
          expect(Number(hr1.rowIndex)).to.eq(0);
          expect(hr1.cells.length).to.eq(2);
          expect(hr1.cells[0].placeholder).to.eq(true);
          expect(hr1.cells[1].placeholder).to.eq(false);
        });

        cy.get('.cdk-overlay-backdrop').click();
    });
  });
});
