import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Seller, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-spacing-example',
  templateUrl: './spacing.component.html',
  styleUrls: ['./spacing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-spacing-example', { title: 'Spacing' })
export class SpacingExample {
  columns = columnFactory()
    .default({ width: '100px', reorder: true, resize: true})
    .table(
      { prop: 'drag_and_drop_handle', type: 'drag_and_drop_handle', minWidth: 24, width: '', maxWidth: 24, wontBudge: true, resize: false, },
      { prop: 'id', pIndex: true, sort: true, width: '40px', wontBudge: true },
      { prop: 'name', sort: true },
      { prop: 'email', minWidth: 250, width: '150px' },
      { prop: 'sales', sort: true },
      { prop: 'address', width: undefined, },
      { prop: 'rating', type: 'starRatings', minWidth: 90, maxWidth: 120 },
    )
    .header(
      { rowClassName: 'pbl-groupby-row' },
      { id: 'pbl-groupby-row', type: 'pbl-groupby-row', label: ' ' },
    )
    .headerGroup(
      { type: 'fixed' },
      {
        label: 'Marketing',
        columnIds: ['name', 'email', 'country', 'rating']
      }
    )
    .build();

  ds = createDS<Seller>()
    .onTrigger( () => this.datasource.getSellers(0, 1000) )
    .create();

  constructor(private datasource: DynamicClientApi) {
  }

  refresh(): void {
    this.datasource.reset('sellers');
    this.ds.refresh();
  }

}
