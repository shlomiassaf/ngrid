import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';
import { PblDragDrop } from '@pebula/ngrid/drag';

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

  constructor(private datasource: DemoDataSource, private dragDrop: PblDragDrop) { }

  ngAfterViewInit() {
    setTimeout(() => {
      const el = document.body.querySelector('.pbl-ngrid-header-row-main');
      const dropListRef = this.dragDrop.createDropList(el as HTMLElement);

      const cells = el.querySelectorAll('pbl-ngrid-header-cell');
      for (const cell of Array.from(cells)) {
        const dragRef = this.dragDrop.createDrag(cell as HTMLElement);
      }
    }, 500);
  }
}
