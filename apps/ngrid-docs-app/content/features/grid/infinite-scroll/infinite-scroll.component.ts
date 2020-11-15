import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-infinite-scroll-example',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-infinite-scroll-example', { title: 'Infinite Scroll' })
export class InfiniteScrollExample {
  loading = false;

  columns = columnFactory()
    .table(
      { prop: 'id', width: '100px' },
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();

  ds = createDS<Person>()
    .onTrigger(event => {
      if (!this.allPeople) {
        return this.datasource.getPeople(100, 1000)
          .then( people => {
            this.allPeople = people;
            return this.allPeople.slice(0, Math.min(this.allPeople.length, (this.ds.source || []).length + 50));
          });
      } else {
        this.loading = false;
        return Promise.resolve(this.allPeople.slice(0, Math.min(this.allPeople.length, this.ds.source.length + 50)));
      }
    })
    .create();

  private allPeople: Person[];

  constructor(private datasource: DynamicClientApi) {
  }

  ngAfterViewInit() {
    this.ds.onRenderedDataChanged.subscribe(() => {
      if (this.ds.length - this.ds.renderStart < 20) {
        if (!this.loading) {
          this.loading = true;
          setTimeout(() => this.ds.refresh(), Math.random() * 1000);
        }
      }
    });
  }
}
