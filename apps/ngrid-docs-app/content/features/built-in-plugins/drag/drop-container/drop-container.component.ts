import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';
import { PblColumnDragDropContainerEnter, PblColumnDragDropContainerExit, PblColumnDragDropContainerDrop } from '@pebula/ngrid/drag';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-drop-container-example',
  templateUrl: './drop-container.component.html',
  styleUrls: ['./drop-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-drop-container-example', { title: 'Drop Container' })
export class DropContainerExample {
  columns = columnFactory()
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  @ViewChild(PblNgridComponent) grid: PblNgridComponent<Person>;

  constructor(private datasource: DynamicClientApi) { }

  columnEntered(event: PblColumnDragDropContainerEnter) {
  }

  columnExited(event: PblColumnDragDropContainerExit) {
  }

  columnDropped(event: PblColumnDragDropContainerDrop) {
    if (event.isPointerOverContainer) {
      event.container.grid.columnApi.hideColumns(event.item.column);
    } else {
      event.container.grid.columnApi.showColumns(event.item.column);
    }
  }
}
