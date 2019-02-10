import { Pipe, PipeTransform } from '@angular/core';

import { PblTableComponent } from '../table.component';
import { MetaCellContext, PblTableMetaCellContext } from '../context/index';
import { PblMetaColumn } from '../columns';

@Pipe({ name: 'tableMetaCellContext' })
export class TableMetaCellContextPipe implements PipeTransform {
  transform<T>(col: PblMetaColumn, table: PblTableComponent<T>): PblTableMetaCellContext<T> {
    return new MetaCellContext<T>(col, table);
  }
}
