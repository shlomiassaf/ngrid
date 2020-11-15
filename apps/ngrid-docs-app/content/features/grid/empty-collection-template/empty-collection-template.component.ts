import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-empty-collection-template-example',
  templateUrl: './empty-collection-template.component.html',
  styleUrls: ['./empty-collection-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-empty-collection-template-example', { title: 'Synchronous (immediate) Empty set' })
export class EmptyCollectionTemplateExample {
  columns = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id' },
      { prop: 'name' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => [] ).create();
}
