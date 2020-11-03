export class NGridHarness {
  constructor(public readonly element: HTMLElement) {
    const fixedMetaRows = element.querySelector('div[pbl-ngrid-fixed-meta-row-container="header"');
    const viewPort = element.querySelector('pbl-cdk-virtual-scroll-viewport');
    const cdkTable = viewPort.querySelector('pbl-cdk-table');
  }

  getColumns() {
    const fixedMetaRows = this.element.querySelector('div[pbl-ngrid-fixed-meta-row-container="header"');
    const columnRows = fixedMetaRows.querySelectorAll('pbl-ngrid-column-row');
    const [gridWidthRow, columnRow] = Array.from(columnRows);
    const headerCells = columnRow.querySelectorAll('pbl-ngrid-header-cell');

    const CLASS_COLUMN_RE = /^cdk-column-(.+)$/;
    return Array.from(headerCells).map( e => {
      for (let i = 0; i < e.classList.length; i++) {
        const match = e.classList.item(i).match(CLASS_COLUMN_RE);
        if (match) {
          return match[1];
        }
      }
    });
  }
}
