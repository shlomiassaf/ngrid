import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { columnFactory } from '@pebula/ngrid';
import { createInfiniteScrollDS } from '@pebula/ngrid/infinite-scroll';

import { Person, NgridDemoRestApiClient } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-custom-triggers-example',
  templateUrl: './custom-triggers.component.html',
  styleUrls: ['./custom-triggers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-custom-triggers-example', { title: 'Custom Triggers' })
export class CustomTriggersExample {
  columns = columnFactory()
  .table(
    { prop: 'id', width: '100px', pIndex: true },
    { prop: 'name', width: '100px' },
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
  .setCustomTriggers('filter', 'sort') // pagination is simply ignored in this case
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
      switch (event.eventSource) {
        case 'infiniteScroll':
          return this.client.getPeople({
            pagination: { skip: event.fromRow, limit: event.toRow - event.fromRow + 1},
          }).then( resp => resp.items );
        case 'customTrigger':
          if (event.sort.changed) {
            // handle sort, go to server and ask to sort
          } else if (event.filter.changed) {
            // handle filter, go to server and ask to filter
          }
          break;
        default:
          throw new Error('This should NEVER EVENT happen...');
      }
    }
  })
  .create();

  constructor(private client: NgridDemoRestApiClient) { }
}
