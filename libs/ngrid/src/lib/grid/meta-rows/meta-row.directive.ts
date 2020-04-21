import { Directive, Input, ElementRef, OnDestroy, Attribute } from '@angular/core';

import { PblMetaRowDefinitions } from '../columns/types';
import { PblNgridMetaRowService } from './meta-row.service';

@Directive({
  selector: '[pblMetaRow]',
})
export class PblMetaRowDirective implements OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('pblMetaRow') get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) {
    if (value !== this._meta) {
      this.update(value);
    }
  }

  public readonly gridWidthRow: boolean;

  private _meta: PblMetaRowDefinitions;

  constructor(public readonly metaRows: PblNgridMetaRowService,
              public elRef: ElementRef<HTMLElement>,
              @Attribute('gridWidthRow') gridWidthRow: any) {
    this.gridWidthRow = gridWidthRow !== null;
  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
  }

  private update(meta: PblMetaRowDefinitions): void {
    const oldMeta = this._meta;

    if (oldMeta) {
      if(oldMeta.rowClassName) {
        this.elRef.nativeElement.classList.remove(oldMeta.rowClassName);
      }
      this.metaRows.removeMetaRow(this);
    }
    this._meta = meta;
    if (meta) {
      if (meta.rowClassName) {
        this.elRef.nativeElement.classList.add(meta.rowClassName);
      }
      this.metaRows.addMetaRow(this);
    }
  }
}
