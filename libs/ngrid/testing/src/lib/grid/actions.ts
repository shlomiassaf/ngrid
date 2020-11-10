import { PblNgridHarness } from './ngrid-component-harness';

declare module './ngrid-component-harness' {
  interface PblNgridHarness {
    scrollToEnd(): Promise<void>;
    getColumnIds(): Promise<string[]>;
    getViewPortData(): Promise<string[][]>;
  }
}

async function getColumnIds(this: PblNgridHarness) {
  return this.getColumnHeaderRow()
    .then( header => header.getCells() )
    .then( columns => Promise.all(columns.map( c => c.getColumnId() )) );
}

async function getViewPortData(this: PblNgridHarness) {
  return this.getDataRows()
    .then( rows => rows.map( r => r.getCells().then( cells => cells.map(c => c.getText() )) ) )
    .then( rows => Promise.all(rows.map( pRow => pRow.then( row => Promise.all(row) ))));
}

async function scrollToEnd(this: PblNgridHarness) {
  const viewPort = await this.locatorFor('pbl-cdk-virtual-scroll-viewport')();
  viewPort['element'].scrollTop = 500;
}


PblNgridHarness.register('scrollToEnd', scrollToEnd);
PblNgridHarness.register('getColumnIds', getColumnIds);
PblNgridHarness.register('getViewPortData', getViewPortData);
