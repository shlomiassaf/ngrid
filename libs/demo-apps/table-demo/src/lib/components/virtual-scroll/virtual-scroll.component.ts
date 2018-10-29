/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
/* @sac-example:ex-4 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy } from '@angular/cdk-experimental/scrolling';
import {
  createDS,
  columnFactory,
  SgTableComponent,
  SgTableConfigService,
  NoVirtualScrollStrategy
} from '@sac/table';
import { Person, DemoDataSource } from '@sac/demo-apps/shared';

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
  selector: 'sac-virtual-scroll-table-example-component',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollTableExampleComponent {


  columns = COLUMNS;
  ds1 = createDS<Person>()
    .skipInitialTrigger()
    .onTrigger( () => this.datasource.getPeople(0, 500) )
    .create();

  ds2 = createDS<Person>()
    .skipInitialTrigger()
    .onTrigger( () => this.datasource.getPeople(0, 500) )
    .create();

  ds3 = createDS<Person>()
    .skipInitialTrigger()
    .onTrigger( () => this.datasource.getPeople(0, 500) )
    .create();

  ds4: VirtualScrollTableExampleComponent['ds3'];

  constructor(private config: SgTableConfigService, private datasource: DemoDataSource) {}

  setDefaultStrategy(type: 'auto' | 'fixed' | 'none', count: string): void {
    /* SET DEFAULT SCROLL STRATEGY TO NO SCROLL */
    this.config.set('virtualScroll', {
      defaultStrategy() {
        switch (type) {
          case 'auto':
            return new AutoSizeVirtualScrollStrategy(100, 200);
          case 'fixed':
            return new FixedSizeVirtualScrollStrategy(48, 100, 200);
          case 'none':
            return new NoVirtualScrollStrategy();
        }
      }
    });
    this.ds4 = createDS<Person>()
      .onTrigger( () => this.datasource.getPeople(0, Number(count)) )
      .create();
  }

  loadData(table: SgTableComponent<any>): void {
    table.dataSource.refresh();
  }
}
/* @sac-example:ex-4 */
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
