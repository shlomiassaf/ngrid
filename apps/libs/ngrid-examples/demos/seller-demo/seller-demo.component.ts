import { Component, ViewChild,  ChangeDetectionStrategy } from '@angular/core';

import { PblNgridComponent, createDS, columnFactory } from '@pebula/ngrid';
import { Seller, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

// A function that returns the currency value placed in a `SecurityWithMarketDataDto` object.
// implementation is an IIFE that returns the getValue method bound to an PblColumn instance of the currency column...
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

@Component({
  selector: 'pbl-seller-demo-example',
  templateUrl: './seller-demo.component.html',
  styleUrls: ['./seller-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-seller-demo-example', { title: 'Seller Demo' })
export class SellerDemoExample {

  columns = columnFactory()
    .default({ width: '100px', reorder: true, resize: true})
    .table(
      { prop: 'drag_and_drop_handle', type: 'drag_and_drop_handle', minWidth: 24, width: '', maxWidth: 24, wontBudge: true, resize: false, },
      { prop: 'selection',  minWidth: 48, width: '', maxWidth: 48, wontBudge: true, resize: false, },
      { prop: 'id', pIndex: true, sort: true, width: '40px', wontBudge: true },
      { prop: 'name', sort: true },
      { prop: 'email', minWidth: 250, width: '150px' },
      { prop: 'country', headerType: 'country', type: { name: 'countryNameDynamic', data: COUNTRY_GETTER }, width: '150px' },
      { prop: 'sales', sort: true },
      { prop: 'address', width: undefined, },
      { prop: 'rating', type: 'starRatings', minWidth: 90, maxWidth: 120 },
      { prop: 'feedback', sort: true, type: { name: 'progressBar', data: { style: progressBarStyle } }, width: '150px' },
    )
    .header(
      { rowClassName: 'pbl-groupby-row' },
      { id: 'pbl-groupby-row', type: 'pbl-groupby-row', label: ' ' },
    )
    .headerGroup(
      { type: 'fixed' },
      {
        prop: 'name',
        span: 3,
        label: 'Marketing'
      }
    )
    .build();

  ds = createDS<Seller>()
    .onTrigger( () => this.datasource.getSellers(0, 1000) )
    .create();

  @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<Seller>;

  constructor(private datasource: DemoDataSource) {
    datasource.getCountries().then( c => COUNTRY_GETTER.data = c );
  }

  refresh(): void {
    this.datasource.reset('sellers');
    this.table.ds.refresh();
  }

  dropped(e) {
    console.log(e);
  }
}
