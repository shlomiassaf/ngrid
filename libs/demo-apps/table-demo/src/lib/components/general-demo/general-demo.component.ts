import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@neg/table';
import { ExampleGroupComponent, Customer, DemoDataSource } from '@neg/demo-apps/shared';

const COUNTRY_GETTER = {
  currency: row => COUNTRY_GETTER.data.countries[row.country].currencies[0],
  flagAndCountry: row => COUNTRY_GETTER.flag(row) + ' ' + COUNTRY_GETTER.name(row),
  name: row => COUNTRY_GETTER.data.countries[row.country].name,
  flag: row => COUNTRY_GETTER.data.countries[row.country].emoji,
  data: undefined as any
}

const ACCOUNT_BALANCE_TYPE = { name: 'accountBalance', data: { neg: 'balance-negative', pos: 'balance-positive', format: '1.0-2', meta: COUNTRY_GETTER } };

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'selection', width: '48px' },
    { prop: 'name', sort: true },
    { prop: 'country', headerType: 'country', type: { name: 'flagAndCountry', data: COUNTRY_GETTER }, width: '150px' },
    { prop: 'jobTitle'  },
    { prop: 'accountId'  },
    { prop: 'accountType' },
    { prop: 'primeAccount', type: 'visualBool', width: '24px' },
    { prop: 'creditScore', type: 'ratings', width: '50px' },
    { prop: 'balance', type: ACCOUNT_BALANCE_TYPE, sort: true },
    ...Array.from(new Array(12)).map( (item, idx) => ({prop: `monthlyBalance.${idx}`, type: ACCOUNT_BALANCE_TYPE, sort: true }) )
  )
  .headerGroup(
    {
      prop: 'name',
      span: 2,
      label: 'Customer Info',
    },
    {
      prop: 'accountId',
      span: 4,
      label: 'Account Info',
    },
    {
      prop: 'monthlyBalance.0',
      label: 'Monthly Balance',
    }
  )
  .build();

@Component({
  selector: 'neg-general-demo',
  templateUrl: './general-demo.component.html',
  styleUrls: ['./general-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDemoTableExampleComponent {

  columns = COLUMNS;
  dataSource = createDS<Customer>()
    .onTrigger( () => this.datasource.getCustomers(500, this.collectionSize) )
    .create();

  collectionSize = 100;

  constructor(private datasource: DemoDataSource, private exampleGroup: ExampleGroupComponent) {
    exampleGroup.hideToc = true;
    datasource.getCountries().then( c => COUNTRY_GETTER.data = c );
  }

  ngOnDestroy(): void {
    this.exampleGroup.hideToc = false;
  }

  collectionSizeChange(value: number): void {
    this.collectionSize = value;
    this.dataSource.refresh();
  }
}
