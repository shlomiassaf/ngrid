import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-predicate-example',
  templateUrl: './predicate.component.html',
  styleUrls: ['./predicate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-predicate-example', { title: 'Predicate' })
export class PredicateExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'detailRowHandle', label: ' ', type: 'detailRowHandle', minWidth: 48, maxWidth: 48 },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 4) ).create();

  detailRow: 'on' | 'off' | 'predicate' = 'off';
  detailRowPredicate: ( (index: number, rowData: Person) => boolean ) | true | undefined;
  private detailRowEvenPredicate = (index: number, rowData: Person) => index % 2 !== 0;

  constructor(private datasource: DemoDataSource) { }

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

}
