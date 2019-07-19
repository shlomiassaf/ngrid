import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Customer, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

const ACCOUNT_BALANCE_TYPE = { name: 'accountBalance', data: { neg: 'rgba(255, 0, 0, 0.33)', pos: 'rgba(0, 128, 0, 0.33)', format: '1.0-2' } };

@Component({
  selector: 'pbl-column-header-menu-example',
  templateUrl: './column-header-menu.component.html',
  styleUrls: ['./column-header-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-header-menu-example', { title: 'Column Header Menu' })
export class ColumnHeaderMenuExample {
  columns = columnFactory()
    .default({ minWidth: 100, resize: true })
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', sort: true, reorder: true },
      { prop: 'jobTitle'  },
      { prop: 'accountId'  },
      { prop: 'accountType', reorder: true },
      { prop: 'primeAccount', type: 'visualBool', width: '24px' },
      { prop: 'creditScore', type: 'starRatings', width: '50px' },
      { prop: 'balance', type: ACCOUNT_BALANCE_TYPE, sort: true },
      ...Array.from(new Array(12)).map( (item, idx) => ({prop: `monthlyBalance.${idx}`, type: ACCOUNT_BALANCE_TYPE, sort: true }) )
    )
    .build();

  ds = createDS<Customer>().onTrigger( () => this.datasource.getCustomers(500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
