/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Seller, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-overlay-panel-grid-example-component',
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayPanelGridExampleComponent {


  columns = columnFactory()
    .table(
      { prop: 'id', sort: true, width: '40px', wontBudge: true },
      { prop: 'name', sort: true },
      { prop: 'email', minWidth: 250, width: '250px' },
      { prop: 'address' },
      { prop: 'rating', type: 'starRatings', width: '120px' }
    )
    .build();

  ds = createDS<Seller>().onTrigger( () => this.datasource.getSellers(500) ).create();

  emailWidth = 250;

  constructor(private datasource: DemoDataSource) { }

  afterLoadState(): void {
    this.emailWidth = this.ds.hostGrid.columnApi.findColumn('email').parsedWidth.value;
  }

  swapNameAndRating(): void {
    const grid = this.ds.hostGrid;
    const name = grid.columnApi.findColumn('name');
    const rating = grid.columnApi.findColumn('rating');
    grid.columnApi.swapColumns(name, rating)

  }

  updateEmailWidth(width: number): void {
    const grid = this.ds.hostGrid;
    const email = grid.columnApi.findColumn('email');
    grid.columnApi.resizeColumn(email, `${width}px`);
  }
}
/* @pebula-example:ex-1 */
