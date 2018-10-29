import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';
import { CDK_ROW_TEMPLATE, CdkRow } from '@angular/cdk/table';

@Component({
  selector: 'neg-table-row:not([detailRow])',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'neg-table-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: NegTableRowComponent }
  ],
  exportAs: 'negTableRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NegTableRowComponent extends CdkRow { }
