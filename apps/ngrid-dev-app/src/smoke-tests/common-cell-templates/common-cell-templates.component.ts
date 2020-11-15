import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-common-cell-templates',
  templateUrl: './common-cell-templates.component.html',
  styleUrls: [ './common-cell-templates.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CommonCellTemplatesComponent { }
