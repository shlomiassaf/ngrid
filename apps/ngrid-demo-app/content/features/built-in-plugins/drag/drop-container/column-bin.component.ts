import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblColumn } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';
import { PblColumnDragDropContainerEnter, PblColumnDragDropContainerExit, PblColumnDragDropContainerDrop } from '@pebula/ngrid/drag';

@Component({
  selector: 'pbl-column-bin-example',
  templateUrl: './column-bin.component.html',
  styleUrls: ['./column-bin.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-bin-example', { title: 'Column Bin' })
export class ColumnBinExample {
  columns = columnFactory()
    .default({ width: '100px', reorder: true, resize: true})
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  private displayValue: any;

  constructor(private datasource: DemoDataSource) { }

  columnEntered(event: PblColumnDragDropContainerEnter) {
    this.displayValue = event.item.getPlaceholderElement().style.display;
    event.item.getPlaceholderElement().style.display = 'none';
    // event.container._dropListRef._cacheParentPositions();
  }

  columnExited(event: PblColumnDragDropContainerExit) {
    event.item.getPlaceholderElement().style.display = this.displayValue;
  }

  columnDropped(event: PblColumnDragDropContainerDrop) {
    if (event.isPointerOverContainer) {
      event.container.grid.columnApi.hideColumns(event.item.column);
    } else {
      event.container.columnContainer.addDrag(event.item);
    }
  }
}
