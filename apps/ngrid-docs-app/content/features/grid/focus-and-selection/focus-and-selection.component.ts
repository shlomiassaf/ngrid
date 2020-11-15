import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent, GridDataPoint } from '@pebula/ngrid';

import { Seller, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-focus-and-selection-example',
  templateUrl: './focus-and-selection.component.html',
  styleUrls: ['./focus-and-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-focus-and-selection-example', { title: 'Focus And Selection' })
export class FocusAndSelectionExample {
  columns = columnFactory()
    .table(
      { prop: 'id', sort: true, width: '40px', wontBudge: true },
      { prop: 'name', sort: true },
      { prop: 'email', minWidth: 250, width: '150px' },
      { prop: 'address' },
      { prop: 'rating', type: 'starRatings', width: '120px' }
    )
    .build();

  ds = createDS<Seller>().onTrigger( () => this.datasource.getSellers(500) ).create();

  constructor(private datasource: DynamicClientApi) { }

  applyRange(gridInstance: PblNgridComponent<Seller>, size: number): void {
    if (!size) {
      gridInstance.contextApi.unselectCells(true);
    } else {
      const focused = gridInstance.contextApi.focusedCell;
      if (focused) {
        const toFocus: GridDataPoint[] = [];

        for (let i = 0; i < size; i++) {
          const rowContextState = gridInstance.contextApi.findRowInCache(focused.rowIdent, i, true);
          if (rowContextState) {
            for (let colIndex = 0; colIndex < size; colIndex++) {
              if (rowContextState.cells[focused.colIndex + colIndex]) {
                toFocus.push({ rowIdent: rowContextState.identity, colIndex: focused.colIndex + colIndex })
              }
            }
          }
        }
        gridInstance.contextApi.selectCells(toFocus, true, true);
      }
    }
  }
}
