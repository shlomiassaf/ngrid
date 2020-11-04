import { NGridHarnessActions } from './actions';

export class NGridHarness {
  public readonly actions = new NGridHarnessActions(this);

  constructor(public readonly element: HTMLElement) {
    const fixedMetaRows = element.querySelector('div[pbl-ngrid-fixed-meta-row-container="header"');
    const viewPort = element.querySelector('pbl-cdk-virtual-scroll-viewport');
    const cdkTable = viewPort.querySelector('pbl-cdk-table');
  }

  getHeaderMetRows() {
    const fixedMetaRows = this.element.querySelector('div[pbl-ngrid-fixed-meta-row-container="header"');
    const fixedHeaderMetaRows = fixedMetaRows.querySelectorAll('pbl-ngrid-meta-row');

    const viewPort = this.element.querySelector('pbl-cdk-virtual-scroll-viewport');
    const cdkTable = viewPort.querySelector('pbl-cdk-table');
    const headerMetaRows = cdkTable.querySelectorAll('pbl-ngrid-meta-row');

    const CLASS_ROW_INDEX_RE = /^pbl-ngrid-row-index-(\d+)$/;
    return [
      ...Array.from(fixedHeaderMetaRows).map( e => {
        const match = this.findClassMatch(e, CLASS_ROW_INDEX_RE);
        return {
          type: 'fixed' as const,
          isGroup: e.classList.contains('pbl-meta-group-row'),
          rowIndex: match[1],
          cells: Array.from(e.querySelectorAll('pbl-ngrid-meta-cell')).map(c => this.parseMetaCell(c)),
        }
      }),
      ...Array.from(headerMetaRows).map( e => {
        const match = this.findClassMatch(e, CLASS_ROW_INDEX_RE);
        return {
          type: e.classList.contains('cdk-table-sticky') ? 'sticky' as const : 'row' as const,
          isGroup: e.classList.contains('pbl-meta-group-row'),
          rowIndex: match[1],
          cells: Array.from(e.querySelectorAll('pbl-ngrid-meta-cell')).map(c => this.parseMetaCell(c)),
        }
      })
    ];
  }

  getColumns() {
    const fixedMetaRows = this.element.querySelector('div[pbl-ngrid-fixed-meta-row-container="header"');
    const columnRows = fixedMetaRows.querySelectorAll('pbl-ngrid-column-row');
    const [gridWidthRow, columnRow] = Array.from(columnRows);
    const headerCells = columnRow.querySelectorAll('pbl-ngrid-header-cell');

    const CLASS_COLUMN_RE = /^cdk-column-(.+)$/;
    return Array.from(headerCells).map( e => {
      for (let i = 0; i < e.classList.length; i++) {
        const match = this.findClassMatch(e, CLASS_COLUMN_RE);
        if (match) {
          return match[1];
        }
      }
    });
  }

  private parseMetaCell(e: Element) {
    const groupCell = e.classList.contains('pbl-header-group-cell');
    if (groupCell) {
      const CLASS_GROUP_CELL_RE = /^cdk-column-group-(.+)-row-\d+$/;
      const CLASS_GROUP_SLAVE_CELL_RE = /^cdk-column-group-(.+)-row-\d+-slave\d+$/;

      const match = this.findClassMatch(e, CLASS_GROUP_CELL_RE);
      return {
        groupCell: true,
        slave: !match,
        id: match ? match[1] : this.findClassMatch(e, CLASS_GROUP_SLAVE_CELL_RE)[1] ,
        placeholder: e.classList.contains('pbl-header-group-cell-placeholder'),
        el: e,
      }
    }

    const CLASS_COLUMN_RE = /^cdk-column-(.+)$/;
    return {
      id: this.findClassMatch(e, CLASS_COLUMN_RE)[1],
      el: e,
    }
  }

  private findClassMatch(e: Element, regExp: RegExp): RegExpMatchArray | undefined {
    for (let i = 0; i < e.classList.length; i++) {
      const match = e.classList.item(i).match(regExp);
      if (match) {
        return match;
      }
    }
  }
}
