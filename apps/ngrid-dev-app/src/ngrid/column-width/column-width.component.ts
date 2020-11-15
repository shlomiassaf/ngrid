import { Component, ChangeDetectionStrategy } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Seller, StaticRestClientApi } from '@pebula/apps/dev-app-lib/client-api';

@Component({
  selector: 'pbl-column-width-example',
  templateUrl: './column-width.component.html',
  styleUrls: ['./column-width.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnWidthExample {
  columns = columnFactory()
    .table(
      { prop: 'id' },
      { prop: 'name' },
      { prop: 'email' },
      { prop: 'address' }
    )
    .build();

  ds = createDS<Seller>()
    .onTrigger( () => this.clientApi.getSellersAll() )
    .create();

  constructor(private clientApi: StaticRestClientApi) { }
}
