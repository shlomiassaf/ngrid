import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/docs-app-lib';
import { createDS } from '@pebula/ngrid';
import { of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'pbl-datasource-introduction-simple-model-example',
  templateUrl: './simple-model.component.html',
  styleUrls: ['./simple-model.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-datasource-introduction-simple-model-example', { title: 'Simple Model' })
export class DatasourceIntroductionSimpleModelExample {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  ds = [{ id: 10, name: 'John Doe', email: 'john.doe@anonymous.com' }];
}
