import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';
import { CDK_ROW_TEMPLATE, CdkRow } from '@angular/cdk/table';

@Component({
  selector: 'sg-table-row:not([detailRow])',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'sg-table-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: SgTableRowComponent }
  ],
  exportAs: 'sgTableRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SgTableRowComponent extends CdkRow { }
