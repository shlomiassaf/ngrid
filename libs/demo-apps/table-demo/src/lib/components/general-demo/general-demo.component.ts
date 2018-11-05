import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';

import { createDS, columnFactory, NegTableComponent } from '@neg/table';
import { ExampleGroupComponent, Customer, DemoDataSource } from '@neg/demo-apps/shared';

const COUNTRY_GETTER = {
  currency: row => COUNTRY_GETTER.data.countries[row.country].currencies[0],
  flagAndCountry: row => COUNTRY_GETTER.flag(row) + ' ' + COUNTRY_GETTER.name(row),
  name: row => COUNTRY_GETTER.data.countries[row.country].name,
  flag: row => COUNTRY_GETTER.data.countries[row.country].emoji,
  data: undefined as any
}

const ACCOUNT_BALANCE_TYPE = { name: 'accountBalance', data: { neg: 'balance-negative', pos: 'balance-positive', format: '1.0-2', meta: COUNTRY_GETTER } };

function createColumns(noType = false) {
  const getType = <T>(type: T): T | undefined => noType ? undefined : type;

  return columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'selection', width: '48px' },
      { prop: 'id', width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'country', headerType: getType('country'), type: getType({ name: 'flagAndCountry', data: COUNTRY_GETTER }), width: '150px' },
      { prop: 'jobTitle'  },
      { prop: 'accountId'  },
      { prop: 'accountType' },
      { prop: 'primeAccount', type: getType('visualBool'), width: '24px' },
      { prop: 'creditScore', type: getType('ratings'), width: '50px' },
      { prop: 'balance', type: getType(ACCOUNT_BALANCE_TYPE), sort: true },
      ...Array.from(new Array(12)).map( (item, idx) => ({prop: `monthlyBalance.${idx}`, type: getType(ACCOUNT_BALANCE_TYPE), sort: true }) )
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
}

@Component({
  selector: 'neg-general-demo',
  templateUrl: './general-demo.component.html',
  styleUrls: ['./general-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneralDemoTableExampleComponent implements OnDestroy {

  columns = createColumns();
  dataSource = this.getDatasource();

  collectionSize = 10000;

  noGpu = false;
  plainColumns = false;
  showTable = true;
  hideColumns: string[] = [];

  @ViewChild(NegTableComponent) negTable: NegTableComponent<any>;

  constructor(private datasource: DemoDataSource, private exampleGroup: ExampleGroupComponent, private cdr: ChangeDetectorRef) {
    exampleGroup.hideToc = true;
    datasource.getCountries().then( c => COUNTRY_GETTER.data = c );
  }

  toggleColumn(coll: string[], id: string): void {
    const idx = coll.indexOf(id);
    if (idx === -1) {
      coll.push(id);
    } else {
      coll.splice(idx, 1);
    }
  }

  togglePlainColumns() {
    this.plainColumns = !this.plainColumns;
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
      this.columns = createColumns(this.plainColumns);
      this.dataSource = this.getDatasource();
      this.cdr.detectChanges();
    }, 100);
  }

  ngOnDestroy(): void {
    this.exampleGroup.hideToc = false;
  }

  collectionSizeChange(value: number): void {
    this.collectionSize = value;
    this.dataSource.refresh();
  }

  private getDatasource() {
    return createDS<Customer>()
      .onTrigger( () => this.datasource.getCustomers(500, this.collectionSize) )
      .create();
  }
}
