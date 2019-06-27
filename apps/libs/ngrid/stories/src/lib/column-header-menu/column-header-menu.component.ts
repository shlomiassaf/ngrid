/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createDS, columnFactory, PblColumn } from '@pebula/ngrid';
import { Customer, DemoDataSource } from '@pebula/apps/ngrid/shared';

const ACCOUNT_BALANCE_TYPE = { name: 'accountBalance', data: { neg: 'rgba(255, 0, 0, 0.33)', pos: 'rgba(0, 128, 0, 0.33)', format: '1.0-2' } };

const COLUMNS = columnFactory()
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


@Component({
  selector: 'pbl-column-header-menu-grid-example-component',
  templateUrl: './column-header-menu.component.html',
  styleUrls: ['./column-header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnHeaderMenuGridExampleComponent {

  columns = COLUMNS;
  ds = createDS<Customer>().onTrigger( () => this.datasource.getCustomers(500) ).create();


  constructor(private datasource: DemoDataSource) { }

}
/* @pebula-example:ex-1 */
