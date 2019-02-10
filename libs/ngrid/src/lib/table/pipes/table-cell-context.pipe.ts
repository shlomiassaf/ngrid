import { Pipe, PipeTransform } from '@angular/core';

import { PblNgridComponent } from '../table.component';
import { MetaCellContext, PblNgridMetaCellContext } from '../context/index';
import { PblMetaColumn } from '../columns';

@Pipe({ name: 'tableMetaCellContext' })
export class TableMetaCellContextPipe implements PipeTransform {
  transform<T>(col: PblMetaColumn, table: PblNgridComponent<T>): PblNgridMetaCellContext<T> {
    return new MetaCellContext<T>(col, table);
  }
}
