/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';
import { PblNgridOverlayPanelFactory } from '@pebula/ngrid/overlay-panel';
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

  ds = createDS<Seller>().onTrigger( () => this.datasource.getSellers(0, 100) ).create();

  @ViewChild(PblNgridComponent, { static: true }) ngrid: PblNgridComponent;

  constructor(private datasource: DemoDataSource,
              private overlayPanelFactory: PblNgridOverlayPanelFactory) { }

  show(): void {
    const overlayPanel = this.overlayPanelFactory.create(this.ngrid);
    overlayPanel.openGridCell(
      'myUniquePanelName',
      'name',
      'header',
      {
        hasBackdrop: true,
        xPos: 'after',
        yPos: 'below',
      }
    );
  }
}
/* @pebula-example:ex-1 */
