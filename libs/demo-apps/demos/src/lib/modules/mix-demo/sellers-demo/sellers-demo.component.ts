import { Component, ViewChild } from '@angular/core';

import { NegTableComponent, createDS, columnFactory } from '@neg/table';
import { Seller, DemoDataSource } from '@neg/demo-apps/shared';

// A function that returns the currency value placed in a `SecurityWithMarketDataDto` object.
// implementation is an IIFE that returns the getValue method bound to an NegColumn instance of the currency column...
const COUNTRY_GETTER = {
  currency: row => COUNTRY_GETTER.data.countries[row.country].currencies[0],
  name: row => COUNTRY_GETTER.flag(row) + ' ' + COUNTRY_GETTER.data.countries[row.country].name,
  flag: row => COUNTRY_GETTER.data.countries[row.country].emoji,
  data: undefined as any
}

const progressBarStyle = (value: number) => {
  if (value > 60) {
    return { color: 'white', background: 'green' };
  }
  if (value >=40 && value <= 60) {
    return { color: 'white', background: 'deepskyblue' };
  }
  return { color: 'white', background: 'red' };
}
const COLUMNS = columnFactory()
  .default({ width: '100px', reorder: true, resize: true})
  .table(
    { prop: 'drag_and_drop_handle', type: 'drag_and_drop_handle', minWidth: 24, width: '', maxWidth: 24, wontBudge: true, resize: false, },
    { prop: 'selection',  minWidth: 48, width: '', maxWidth: 48, wontBudge: true, resize: false, },
    { prop: 'id', sort: true, width: '40px', wontBudge: true },
    { prop: 'name', sort: true },
    { prop: 'email', minWidth: 250, width: '150px' },
    { prop: 'country', headerType: 'country', type: { name: 'countryNameDynamic', data: COUNTRY_GETTER }, width: '150px' },
    { prop: 'sales', sort: true },
    { prop: 'address' },
    { prop: 'rating', type: 'starRatings', width: '120px' },
    { prop: 'feedback', sort: true, type: { name: 'progressBar', data: { style: progressBarStyle } }, width: '150px' },
  )
  .header(
    { rowClassName: 'neg-groupby-row' },
    { id: 'neg-groupby-row', type: 'neg-groupby-row', label: ' ' },
  )
  .build();

@Component({
  selector: 'neg-sellers-demo',
  templateUrl: './sellers-demo.component.html',
  styleUrls: ['./sellers-demo.component.scss']
})
export class SellersDemoComponent {
  dataSource = createDS<Seller>()
    .onTrigger( () => this.ds.getSellers(0, 1000) )
    .create();

  columns = COLUMNS;

  @ViewChild(NegTableComponent) table: NegTableComponent<Seller>;

  constructor(private ds: DemoDataSource) {
    ds.getCountries().then( c => COUNTRY_GETTER.data = c );
  }

  refresh(): void {
    this.ds.reset('sellers');
    this.table.ds.refresh();
  }
  dropped(e) {
    console.log(e);
  }
}
