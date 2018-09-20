import { Pipe, PipeTransform } from '@angular/core';

import { SgTableCellTemplateContext, SgTableMetaCellTemplateContext, SgColumn, SgMetaColumn } from '../columns';
import { SgTableComponent } from '../table.component';

export class _SgTableMetaCellTemplateContext<T> implements SgTableMetaCellTemplateContext<T> {
  get $implicit(): _SgTableMetaCellTemplateContext<T> { return this; }

  constructor(public col: SgMetaColumn, public table: SgTableComponent<any>) {}
}

export class _SgTableCellTemplateContext<T> implements SgTableCellTemplateContext<T> {
  get $implicit(): _SgTableCellTemplateContext<T> { return this; }

  get value(): any { return this.col.getValue(this.row); }
  set value(v: any) { this.col.setValue(this.row, v); }

  constructor(public row: T, public col: SgColumn, public table: SgTableComponent<any>) {}
}

@Pipe({
  name: 'tableCellContext'
})
export class TableCellContextPipe implements PipeTransform {
  transform<T>(col: SgMetaColumn, table: SgTableComponent<T>): _SgTableMetaCellTemplateContext<T>;
  transform<T>(row: T, col: SgColumn, table: SgTableComponent<T>): _SgTableCellTemplateContext<T>;
  transform<T>(row: any, col: any, table?: any):  _SgTableMetaCellTemplateContext<T> | _SgTableCellTemplateContext<T> {
    if (row instanceof SgMetaColumn) {
      return new _SgTableMetaCellTemplateContext<T>(row, col);
    } else {
      return new _SgTableCellTemplateContext<T>(row, col, table);
    }
  }
}
