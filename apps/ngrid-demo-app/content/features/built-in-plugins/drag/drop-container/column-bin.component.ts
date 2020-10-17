import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblColumn } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';
import { PblDragRef } from '@pebula/ngrid/drag/src/lib/drag-and-drop/core/drag-ref';
import { PblNgridColumnDragDirective } from '@pebula/ngrid/drag';

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

  constructor(private datasource: DemoDataSource) { }

  columnEntered(event: PblDragRef<PblNgridColumnDragDirective<any>>) {
    event.getPlaceholderElement().style.display = 'none';
  }
}
