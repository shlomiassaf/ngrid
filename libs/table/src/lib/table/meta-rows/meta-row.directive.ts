import { Directive, Input, ElementRef, OnDestroy } from '@angular/core';

import { UnRx } from '@pebula/utils';

import { NegMetaRowDefinitions } from '../columns/types';

import { NegColumnStoreMetaRow } from '../columns/column-store';
import { NegTableMetaRowService } from './meta-row.service';


@Directive({
  selector: '[negMetaRow]',
})
@UnRx()
export class NegMetaRowDirective implements OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('negMetaRow') get meta(): NegMetaRowDefinitions { return this._meta; }
  set meta(value: NegMetaRowDefinitions) {
    if (value !== this._meta) {
      this.update(value);
    }
  }

  private _meta: NegMetaRowDefinitions;

  constructor(public readonly metaRows: NegTableMetaRowService, public elRef: ElementRef<HTMLElement>) {

  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
  }

  private update(meta: NegMetaRowDefinitions): void {
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
