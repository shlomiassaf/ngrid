import { Directive, Input, ElementRef, OnDestroy, Attribute } from '@angular/core';

import { PblMetaRowDefinitions } from '../column/model/types';
import { PblNgridMetaRowService } from './meta-row.service';

export interface PblMetaRow {
  element: HTMLElement;
  meta: PblMetaRowDefinitions;
  gridWidthRow: any;
}

@Directive({
  selector: '[pblMetaRow]',
})
export class PblMetaRowDirective implements PblMetaRow, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('pblMetaRow') get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) {
    if (value !== this._meta) {
      this.update(value);
    }
  }

  readonly element: HTMLElement;
  readonly gridWidthRow: boolean;

  private _meta: PblMetaRowDefinitions;

  constructor(public readonly metaRows: PblNgridMetaRowService,
              elRef: ElementRef<HTMLElement>,
              @Attribute('gridWidthRow') gridWidthRow: any) {
    this.gridWidthRow = gridWidthRow !== null;
    this.element = elRef.nativeElement;
  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
  }

  private update(meta: PblMetaRowDefinitions): void {
    const oldMeta = this._meta;

    if (oldMeta) {
      if(oldMeta.rowClassName) {
        this.element.classList.remove(oldMeta.rowClassName);
      }
      this.metaRows.removeMetaRow(this);
    }
    this._meta = meta;
    if (meta) {
      if (meta.rowClassName) {
        this.element.classList.add(meta.rowClassName);
      }
      this.metaRows.addMetaRow(this);
    }
  }
}
