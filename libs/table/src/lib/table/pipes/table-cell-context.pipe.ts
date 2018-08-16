import { Pipe, PipeTransform } from '@angular/core';
import { SgTableCellTemplateContext, SgColumn } from '../columns';

export class _SgTableCellTemplateContext<T> implements SgTableCellTemplateContext<T> {
  get $implicit(): _SgTableCellTemplateContext<T> {
    return this;
  }

  get value(): any {
    return this.col.getValue(this.row);
  }
  set value(v: any) {
    this.col.setValue(this.row, v);
  }
  constructor(public row: T, public col: SgColumn) {}
}

@Pipe({
  name: 'tableCellContext'
})
export class TableCellContextPipe implements PipeTransform {
  transform(row: any, col: SgColumn): any {
    return new _SgTableCellTemplateContext<any>(row, col);
  }
}
