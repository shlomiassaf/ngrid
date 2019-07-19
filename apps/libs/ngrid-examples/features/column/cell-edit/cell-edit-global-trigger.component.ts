import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridCellContext } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-cell-edit-global-trigger-example',
  templateUrl: './cell-edit-global-trigger.component.html',
  styleUrls: ['./cell-edit-global-trigger.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-cell-edit-global-trigger-example', { title: 'Triggering edits globally' })
export class CellEditGlobalTriggerExample {
  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate' },
      { prop: 'lead', editable: true },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }

  changeCheckbox(input: HTMLInputElement, ctx: PblNgridCellContext): void {
    ctx.value = input.checked;
    setTimeout( () => ctx.stopEdit(true) );
  }
}
