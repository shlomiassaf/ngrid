import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { PblNgridComponent, createDS, columnFactory, PblNgridPaginatorKind, AutoSizeToFitOptions } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

// A function that returns the currency value placed in a `SecurityWithMarketDataDto` object.
// implementation is an IIFE that returns the getValue method bound to an PblColumn instance of the currency column...
const COUNTRY_GETTER = {
  currency: row => COUNTRY_GETTER.data.countries[row.country].currencies[0],
  name: row => COUNTRY_GETTER.flag(row) + ' ' + COUNTRY_GETTER.data.countries[row.country].name,
  flag: row => COUNTRY_GETTER.data.countries[row.country].emoji,
  data: undefined as any
}

declare module '@pebula/ngrid/lib/grid/column/model/types' {
  interface PblColumnTypeDefinitionDataMap {
    currencyFn: (row: Person) => string;
    countryNameDynamic: (row: Person) => string;
  }
}

@Component({
  selector: 'pbl-complex-demo1-example',
  templateUrl: './complex-demo1.component.html',
  styleUrls: ['./complex-demo1.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-complex-demo1-example', { title: 'Complex Demo1' })
export class ComplexDemo1Example {
  columns = columnFactory()
    .default({ width: '100px', reorder: true, resize: true})
    .table(
      { header: { type: 'sticky' } },
      { prop: 'drag_and_drop_handle', type: 'drag_and_drop_handle', minWidth: 48, width: '', maxWidth: 48, wontBudge: true },
      { prop: 'selection',  minWidth: 48, width: '', maxWidth: 48, wontBudge: true },
      { prop: 'id', pIndex: true, sort: true, width: '40px', wontBudge: true },
      { prop: 'name', sort: true },
      { prop: 'email', minWidth: 250, width: '150px' },
      { prop: 'country', headerType: 'country', type: { name: 'countryNameDynamic', data: COUNTRY_GETTER }, width: '150px' },
      { prop: 'language', headerType: 'language', width: '125px' },
      { prop: 'lead', type: 'visualBool', width: '24px' },
      { prop: 'rate', type: { name: 'currencyFn', data: COUNTRY_GETTER }, sort: true },
      { prop: 'balance', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'bio' },
      { prop: 'settings.avatar', width: '40px' },
      { prop: 'settings.background' },
      { prop: 'settings.timezone' },
      { prop: 'settings.emailFrequency', editable: true },
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
      { type: 'row' },
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
      { type: 'sticky' },
      {
        prop: 'name',
        span: 3,
        label: 'LOCKED GROUP',
        lockColumns: true,
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

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(500, 1000) ).create();

  @ViewChild(PblNgridComponent, { static: true }) pblTable: PblNgridComponent<any>;

  constructor(private datasource: DynamicClientApi) {
    datasource.getCountries().then( c => COUNTRY_GETTER.data = c );
  }

}
