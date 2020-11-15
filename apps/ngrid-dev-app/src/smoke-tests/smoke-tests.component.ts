import { Component, ChangeDetectionStrategy } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Seller, StaticRestClientApi } from '@pebula/apps/dev-app-lib/client-api';

@Component({
  selector: 'pbl-smoke-example',
  templateUrl: './smoke-tests.component.html',
  styleUrls: ['./smoke-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmokeTestsExample {
  columns = columnFactory()
    .table(
      { prop: 'id' },
      { prop: 'name' },
      { prop: 'email' },
      { prop: 'rating', type: 'starRatings' },
    )
    .build();

  ds = createDS<Seller>()
    .onTrigger( () => this.clientApi.getSellersAll() )
    .create();

  constructor(private clientApi: StaticRestClientApi) { }
}
