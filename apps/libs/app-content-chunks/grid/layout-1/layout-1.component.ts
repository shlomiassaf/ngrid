import { Input, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-grid-layout-1',
  templateUrl: './layout-1.component.html',
  styleUrls: ['./layout-1.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridLayout1ContentChunk {

  @Input() section: number;

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
