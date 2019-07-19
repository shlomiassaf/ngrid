import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-columns-simple-model-example',
  templateUrl: './simple-model.component.html',
  styleUrls: ['./simple-model.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-columns-simple-model-example', { title: 'Simple Model' })
export class ColumnsSimpleModelExample {

  columnsSimpleModel = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  dsSimpleModel = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 1) ).create();

  constructor(private datasource: DemoDataSource) { }
}
