/* @neg-example:ex-1 */
/* @neg-example:ex-2 */
/* @neg-example:ex-3 */
/* @neg-example:ex-4 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@neg/table';

import { Person, DemoDataSource } from '@neg/apps/table/shared';

const COLUMNS = () => columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'detailRowHandle', label: ' ', type: 'detailRowHandle', minWidth: 48, maxWidth: 48 },
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();


@Component({
  selector: 'neg-detail-row',
  templateUrl: './detail-row.component.html',
  styleUrls: ['./detail-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailRowExampleComponent  {


  columns1 = COLUMNS();
  columns2 = COLUMNS();
  columns3 = COLUMNS();
  columns4 = COLUMNS();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
  ds4 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();


  forceSingle: boolean;
  disableName: string[] = [];

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
/* @neg-example:ex-4 */
/* @neg-example:ex-3 */
/* @neg-example:ex-2 */
/* @neg-example:ex-1 */
