describe('ngrid-docs-app', () => {
  beforeEach(() => cy.visit('/features/column/column-group'));

  it('should show column groups', () => {
    cy.get('pbl-column-group-example > pbl-ngrid')
      .nGrid()
      .should((ngrid) => {
        expect(ngrid.getColumns()).to.deep.eq([
          'id',
          'name',
          'gender',
          'email',
          'country',
          'language',
        ]);
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
        expect(hr.cells[1].id).to.eq('name-gender');
      });
  });

  it('should show column groups complex', () => {
    cy.get('pbl-multi-header-column-group-example > pbl-ngrid')
      .nGrid()
      .should((ngrid) => {
        expect(ngrid.getColumns()).to.deep.eq([
          'id',
          'name',
          'gender',
          'email',
          'country',
          'language',
        ]);
        const headerRows = ngrid.getHeaderMetaRows();
        expect(headerRows.length).to.eq(3);
        const [hr0, hr1, hr2] = headerRows;

        expect(hr0.isGroup).to.eq(true);
        expect(hr0.type).to.eq('fixed');
        expect(Number(hr0.rowIndex)).to.eq(0);
        expect(hr0.cells.length).to.eq(4);
        expect(hr0.cells[0].placeholder).to.eq(true);
        expect(hr0.cells[1].placeholder).to.eq(false);
        expect(hr0.cells[2].placeholder).to.eq(true);
        expect(hr0.cells[3].placeholder).to.eq(false);
        expect(hr0.cells[1].id).to.eq('name-gender');

        expect(hr1.isGroup).to.eq(false);
        expect(hr1.type).to.eq('fixed');
        expect(Number(hr1.rowIndex)).to.eq(1);
        expect(hr1.cells.length).to.eq(3);
        expect(hr1.cells[0].id).to.eq('header1');
        expect(hr1.cells[1].id).to.eq('header2');
        expect(hr1.cells[2].id).to.eq('header3');

        expect(hr2.isGroup).to.eq(true);
        expect(hr2.type).to.eq('fixed');
        expect(Number(hr2.rowIndex)).to.eq(2);
        expect(hr2.cells.length).to.eq(3);
        expect(hr2.cells[0].placeholder).to.eq(false);
        expect(hr2.cells[1].placeholder).to.eq(true);
        expect(hr2.cells[2].placeholder).to.eq(false);
        expect(hr2.cells[0].id).to.eq('id-name-gender');
      });
  });
});
