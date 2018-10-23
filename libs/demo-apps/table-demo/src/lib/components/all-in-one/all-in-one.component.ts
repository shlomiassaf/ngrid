import { map } from 'rxjs/operators';

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SgTableComponent, SgDataSource, columnFactory, SgDataSourceAdapter, SgTablePaginatorKind } from '@sac/table';
import { toggleDetailRow } from '@sac/table/detail-row';
import { setStickyRow, setStickyColumns } from '@sac/table/sticky';

import { Person, getPersons, getCountryData } from '../../services';

// A function that returns the currency value placed in a `SecurityWithMarketDataDto` object.
// implementation is an IIFE that returns the getValue method bound to an SgColumn instance of the currency column...
const COUNTRY_GETTER = {
  currency: row => COUNTRY_GETTER.data.countries[row.country].currencies[0],
  name: row => COUNTRY_GETTER.flag(row) + ' ' + COUNTRY_GETTER.data.countries[row.country].name,
  flag: row => COUNTRY_GETTER.data.countries[row.country].emoji,
  data: undefined as any
}

declare module '@sac/table/lib/table/columns/types' {
  interface SgColumnTypeDefinitionDataMap {
    currencyFn: (row: Person) => string;
    countryNameDynamic: (row: Person) => string;
  }
}

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'selection', width: '48px' },
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'email', minWidth: 250, width: '150px' },
    { prop: 'country', headerType: 'country', width: '150px', type: { name: 'countryNameDynamic', data: COUNTRY_GETTER.name } },
    { prop: 'language', headerType: 'language', width: '125px' },
    { prop: 'lead', type: 'visualBool', width: '24px' },
    { prop: 'rate', type: { name: 'currencyFn', data: COUNTRY_GETTER.currency }, sort: true },
    { prop: 'balance', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },
    { prop: 'settings.avatar', width: '40px' },
    { prop: 'settings.background' },
    { prop: 'settings.timezone' },
    { prop: 'settings.emailFrequency' },
    { prop: 'lastLoginIp' }
  )
  .header(
    { id: 'rere', label: 'HEADER' },
  )
  .footer(
    { id: 'reref', label: 'FOOTER' },
  )
  .footer(
    { id: 'rere123f', label: 'FOOTER2' },
  )
  .headerGroup(
    {
      prop: 'name',
      span: 7,
      label: 'Marketing'
    }
  )
  .header(
    { id: 'rere123', label: 'HEADER2' },
  )
  .headerGroup(
    {
      prop: 'name',
      span: 3,
      label: 'Contact Info',
    },
    {
      prop: 'gender',
      span: 2,
      label: 'Personal Info',
    },
    { // WE'RE NOT LINEAR HERE, GROUP COLUMNS ORDER IS BASED ON COLUMN ORDER
      prop: 'rate',
      span: 1,
      label: 'Finance',
    },
    {
      prop: 'settings.avatar',
      span: 3,
      label: 'User Settings',
    }
  )
  .build();

@Component({
  selector: 'sac-all-in-one-table-example-component',
  templateUrl: './all-in-one.component.html',
  styleUrls: ['./all-in-one.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllInOneTableExampleComponent implements AfterViewInit {

  dataSource = new SgDataSource<Person>(new SgDataSourceAdapter(
      () => getPersons(500).pipe(map( data => data.slice(0, 500) ))
    )
  );

  detailRowPredicate: ( (index: number, rowData: Person) => boolean ) | true | undefined;
  detailRow: 'on' | 'off' | 'predicate' = 'off';

  columns = COLUMNS;

  emailFrequencyToggle: boolean;

  usePagination: false | SgTablePaginatorKind = false// 'pageNumber';
  showFooter = false;
  showHeader = true;
  hideColumns: string[] = [];
  toggleTranspose = false;
  boxSpaceModel: 'padding' | 'margin' = 'padding';
  enableRowSelection = true;
  singleDetailRow = false;

  @ViewChild(SgTableComponent) sgTable: SgTableComponent<any>;

  setStickyRow = setStickyRow;
  setStickyColumns = setStickyColumns;

  private detailRowEvenPredicate = (index: number, rowData: Person) => index % 2 !== 0;

  constructor() {
    const s = getCountryData().subscribe( data => {
      COUNTRY_GETTER.data = data;
      s.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.refresh();
  }

  toggleColumn(id: string): void {
    const idx = this.hideColumns.indexOf(id);
    if (idx === -1) {
      this.hideColumns.push(id);
    } else {
      this.hideColumns.splice(idx, 1);
    }
  }

  onDetailRowChange(value: 'on' | 'off' | 'predicate') : void {
    switch(value) {
      case 'off':
        this.detailRowPredicate = undefined;
        break;
      case 'on':
        this.detailRowPredicate = true;
        break;
      case 'predicate':
        this.detailRowPredicate = this.detailRowEvenPredicate;
        break;
    }
  }

  toggleDetailRow(sgTbl: SgTableComponent<any>, item: Person): void {
    toggleDetailRow(sgTbl, item)
  }

  applyFilter(filterValue: string) {
    this.dataSource.setFilter(filterValue.trim(), this.columns.table);
  }
}
