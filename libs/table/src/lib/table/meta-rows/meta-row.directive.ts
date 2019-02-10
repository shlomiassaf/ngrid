import { Directive, Input, ElementRef, OnDestroy } from '@angular/core';

import { UnRx } from '@pebula/utils';

import { PblMetaRowDefinitions } from '../columns/types';

import { PblColumnStoreMetaRow } from '../columns/column-store';
import { PblTableMetaRowService } from './meta-row.service';


@Directive({
  selector: '[negMetaRow]',
})
@UnRx()
export class PblMetaRowDirective implements OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('negMetaRow') get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) {
    if (value !== this._meta) {
      this.update(value);
    }
  }

  private _meta: PblMetaRowDefinitions;

  constructor(public readonly metaRows: PblTableMetaRowService, public elRef: ElementRef<HTMLElement>) {

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
