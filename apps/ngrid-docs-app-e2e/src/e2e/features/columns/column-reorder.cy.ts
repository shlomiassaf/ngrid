describe('ngrid-docs-app', () => {
  beforeEach(() => cy.visit('/features/column/column-reorder'));

  it('should reorder dragged columns with groups', () => {
    cy.get('pbl-group-columns-lock-example > pbl-ngrid')
      .scrollIntoView()
      .nGrid()
      .should((ngrid) => {
        expect(ngrid.getColumns()).to.deep.eq([
          'id',
          'name',
          'gender',
          'email',
          'country',
          'language',
          'birthdate',
          'balance',
        ]);
        const headerRows = ngrid.getHeaderMetaRows();
        expect(headerRows.length).to.eq(2);
        const [hr0, hr1] = headerRows;

        expect(hr0.isGroup).to.eq(true);
        expect(hr0.type).to.eq('fixed');
        expect(Number(hr0.rowIndex)).to.eq(0);
        expect(hr0.cells.length).to.eq(5);
        expect(hr0.cells[0].placeholder).to.eq(true);
        expect(hr0.cells[1].placeholder).to.eq(false);
        expect(hr0.cells[2].placeholder).to.eq(true);
        expect(hr0.cells[3].placeholder).to.eq(false);
        expect(hr0.cells[4].placeholder).to.eq(true);
        expect(hr0.cells[1].id).to.eq('name-gender');

        expect(hr1.isGroup).to.eq(true);
        expect(hr1.type).to.eq('fixed');
        expect(Number(hr1.rowIndex)).to.eq(1);
        expect(hr1.cells.length).to.eq(4);
        expect(hr1.cells[0].placeholder).to.eq(true);
        expect(hr1.cells[1].placeholder).to.eq(false);
        expect(hr1.cells[2].placeholder).to.eq(true);
        expect(hr1.cells[3].placeholder).to.eq(false);
        expect(hr1.cells[1].id).to.eq('gender-email-country');
      })
      .wait(500)
      .then((ngrid) => ngrid.actions.dragMoveColumns('email', 'gender', { delay: 16, steps: 25, smooth: true }))
      .wait(200)
      .then((ngrid) => ngrid.actions.dragMoveColumns('country', 'language', { delay: 16, steps: 25, smooth: true }))
      .wait(200)
      .should((ngrid) => {
        expect(ngrid.getColumns()).to.deep.eq([
          'id',
          'name',
          'email',
          'gender',
          'language',
          'country',
          'birthdate',
          'balance',
        ]);
        const headerRows = ngrid.getHeaderMetaRows();
        expect(headerRows.length).to.eq(2);
        const [hr0, hr1] = headerRows;

        expect(hr0.isGroup).to.eq(true);
        expect(hr0.type).to.eq('fixed');
        expect(Number(hr0.rowIndex)).to.eq(0);
        expect(hr0.cells.length).to.eq(6);
        expect(hr0.cells[0].placeholder).to.eq(true);
        expect(hr0.cells[1].placeholder).to.eq(false);
        expect(hr0.cells[1].el.textContent).to.eq('Un-Locked');
        expect(hr0.cells[2].placeholder).to.eq(true);
        expect(hr0.cells[3].placeholder).to.eq(false);
        expect(hr0.cells[3].el.textContent).to.eq('Un-Locked');
        expect(hr0.cells[3].slave).to.eq(true);
        expect(hr0.cells[1].id).to.eq('name-gender');
        expect(hr0.cells[3].id).to.eq('name-gender');

        expect(hr1.isGroup).to.eq(true);
        expect(hr1.type).to.eq('fixed');
        expect(Number(hr1.rowIndex)).to.eq(1);
        expect(hr1.cells.length).to.eq(5);
        expect(hr1.cells[0].placeholder).to.eq(true);
        expect(hr1.cells[1].placeholder).to.eq(false);
        expect(hr1.cells[1].el.textContent).to.eq('Gender, Email & Country');
        expect(hr1.cells[2].placeholder).to.eq(true);
        expect(hr1.cells[3].placeholder).to.eq(false);
        expect(hr1.cells[3].el.textContent).to.eq('Gender, Email & Country');
        expect(hr1.cells[3].slave).to.eq(true);
        expect(hr1.cells[1].id).to.eq('gender-email-country');
        expect(hr1.cells[3].id).to.eq('gender-email-country');
      });
  });
});
