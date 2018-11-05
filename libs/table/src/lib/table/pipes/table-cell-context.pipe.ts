import { Pipe, PipeTransform } from '@angular/core';

import { NegTableComponent } from '../table.component';
import { MetaCellContext, NegTableMetaCellContext } from '../context';
import { NegMetaColumn } from '../columns';

@Pipe({ name: 'tableMetaCellContext' })
export class TableMetaCellContextPipe implements PipeTransform {
  transform<T>(col: NegMetaColumn, table: NegTableComponent<T>): NegTableMetaCellContext<T> {
    return new MetaCellContext<T>(col, table);
  }
}
