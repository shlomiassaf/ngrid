import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { columnFactory } from '@pebula/ngrid';
import { createInfiniteScrollDS } from '@pebula/ngrid/infinite-scroll';

import { Person, NgridDemoRestApiClient } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-index-based-paging-example',
  templateUrl: './index-based-paging.component.html',
  styleUrls: ['./index-based-paging.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-index-based-paging-example', { title: 'Index Based Paging' })
export class IndexBasedPagingExample {

  columns = columnFactory()
  .table(
    { prop: 'id', width: '100px', pIndex: true },
    { prop: 'name', width: '100px', editable: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date', width: '25%' },
  )
  .build();

ds = createInfiniteScrollDS<Person>()
  .withInfiniteScrollOptions({
    blockSize: 100,
    initialVirtualSize: 100,
  })
  .withCacheOptions('fragmentedBlocks', { strictPaging: false })
  .onTrigger(event => {
    if (event.isInitial) {
      this.ds.setCacheSize(200 * 4);
      return this.client.getPeople({ pagination: { skip: 0, limit: 100 } })
      .then( resp => {
        this.ds.updateVirtualSize(resp.pagination.totalItems);
        event.updateTotalLength(resp.pagination.totalItems);
        return resp.items;
      });
    } else {
      // At this point "event.fromRow" will never be >= to event.totalLength
      // We defined the total length in the first trigger, so the datasource will make sure to avoid requests
      // for data out of range.

      console.log(event.fromRow, event.toRow);

      return this.client.getPeople({
        pagination: { skip: event.fromRow, limit: event.toRow - event.fromRow + 1},
      })
      .then( resp => {
        return resp.items;
      });
    }
  })
  .create();

  constructor(private client: NgridDemoRestApiClient) { }
}
