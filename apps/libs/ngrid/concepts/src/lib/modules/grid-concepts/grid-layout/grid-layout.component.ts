/* @pebula-example:ex-1 ex-2 ex-3 ex-4 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-grid-layout-grid-example-component',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridLayoutGridExampleComponent {

  showHeader = true;
  showFooter = false;

  columns = columnFactory().table(
    { prop: 'id' },
    { prop: 'name' }
  ).build();

  columns1 = columnFactory().table(
    { header: { type: 'fixed' } },
    { prop: 'id' },
    { prop: 'name' }
  ).build();

  columns2 = columnFactory().table(
    { header: { type: 'row' } },
    { prop: 'id' },
    { prop: 'name' }
  ).build();

  columns3 = columnFactory().table(
    { header: { type: 'sticky' } },
    { prop: 'id' },
    { prop: 'name' }
  ).build();


  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 2) ).create();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-1 ex-2 ex-3 ex-4 */
