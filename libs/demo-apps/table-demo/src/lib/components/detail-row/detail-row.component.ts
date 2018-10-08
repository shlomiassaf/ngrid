/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
/* @sac-example:ex-4 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@sac/table';

import { Person, getPersons } from '../../services';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();

@Component({
  selector: 'sac-detail-row',
  templateUrl: './detail-row.component.html',
  styleUrls: ['./detail-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailRowExampleComponent  {


  columns = COLUMNS;

  ds1 = createDS<Person>()
    .onTrigger( () => getPersons().pipe(map( data => data.slice(0, 5) )) )
    .create();


  forceSingle: boolean;
  disableName: string[] = [];

  detailRow: 'on' | 'off' | 'predicate' = 'off';
  detailRowPredicate: ( (index: number, rowData: Person) => boolean ) | true | undefined;
  private detailRowEvenPredicate = (index: number, rowData: Person) => index % 2 !== 0;

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
/* @sac-example:ex-4 */
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
