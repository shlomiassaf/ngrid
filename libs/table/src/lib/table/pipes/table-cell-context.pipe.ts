import { Pipe, PipeTransform } from '@angular/core';

import { NegTableCellTemplateContext, NegTableMetaCellTemplateContext, NegColumn, NegMetaColumn } from '../columns';
import { NegTableComponent } from '../table.component';

export class _NegTableMetaCellTemplateContext<T> implements NegTableMetaCellTemplateContext<T> {
  get $implicit(): _NegTableMetaCellTemplateContext<T> { return this; }

  constructor(public col: NegMetaColumn, public table: NegTableComponent<any>) {}
}

export class _NegTableCellTemplateContext<T> implements NegTableCellTemplateContext<T> {
  get $implicit(): _NegTableCellTemplateContext<T> { return this; }

  get value(): any { return this.col.getValue(this.row); }
  set value(v: any) { this.col.setValue(this.row, v); }

  constructor(public row: T, public col: NegColumn, public table: NegTableComponent<any>) {}
}

@Pipe({
  name: 'tableCellContext'
})
export class TableCellContextPipe implements PipeTransform {
  transform<T>(col: NegMetaColumn, table: NegTableComponent<T>): _NegTableMetaCellTemplateContext<T>;
  transform<T>(row: T, col: NegColumn, table: NegTableComponent<T>): _NegTableCellTemplateContext<T>;
  transform<T>(row: any, col: any, table?: any):  _NegTableMetaCellTemplateContext<T> | _NegTableCellTemplateContext<T> {
    if (row instanceof NegMetaColumn) {
      return new _NegTableMetaCellTemplateContext<T>(row, col);
    } else {
      return new _NegTableCellTemplateContext<T>(row, col, table);
    }
  }
}
