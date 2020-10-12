import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { columnFactory } from '@pebula/ngrid';
import { createInfiniteScrollDS } from '@pebula/ngrid/infinite-scroll';

import { Person, NgridDemoRestApiClient, Response } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

/**
 * In this example we use a simulated REST API that returns a pagination object with fixed item count and a page number.
 * So all responses are in 100 items blocks.
 *
 * When the user scrolls it will most likely hit a value which does not nicely split into a single 100 items block
 * E.G get items 243 to 342.
 *
 * We need to handle this and make 2 calls when it happen, taking only the relevant items from each response.
 *
 * If your server supports SKIP and LIMIT pagination instructions you don't need the 2 calls.
 */
@Component({
  selector: 'pbl-infinite-scroll-data-source-example',
  templateUrl: './infinite-scroll-data-source.component.html',
  styleUrls: ['./infinite-scroll-data-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-infinite-scroll-data-source-example', { title: 'Infinite Scroll Data Source' })
export class InfiniteScrollDataSourceExample {

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
    .withCacheOptions('sequenceBlocks')
    .onTrigger(event => {
      if (event.isInitial) {
        this.ds.setCacheSize(200 * 4);
        return this.client.getPeople({
          pagination: { itemsPerPage: 100, page: 1 },
        })
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
        const r1 = event.fromRow % 100;
        const p1 = Math.floor(event.fromRow / 100) + 1;

        const requests = [
          this.client.getPeople({ pagination: { itemsPerPage: 100, page: p1 } })
        ];
        if (r1 > 0) {
          // We can assume that "event.toRow" will never be greater then "event.totalLength"
          // We defined the total length in the first trigger, so the datasource will make sure that toRow will not exceed the total length
          // If it does, it will be trimmed, and so will the offset.
          requests.push(this.client.getPeople({ pagination: { itemsPerPage: 100, page: p1 + 1 } }));
        }
        return new Observable<Person[]>( s => {
          console.log(`NEW CALL WITH ${event.fromRow} - ${event.toRow}`)
          Promise.all(requests)
            .then( ([resp1, resp2]) => {
              const resp = resp1.items.slice(r1, 100);
              if (resp2) {
                resp.push(...resp2.items.slice(0, r1));
              }
              s.next(resp);
              s.complete();
            })
            .catch(e => s.error(e) );
          return () => console.log(`DONE WITH ${event.fromRow} - ${event.toRow}`)
        });
      }
    })
    .create();

  constructor(private client: NgridDemoRestApiClient) { }
}
