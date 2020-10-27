import { Subject, Observable, of } from 'rxjs';
import { isDevMode, IterableChanges, IterableDiffer, IterableDiffers } from '@angular/core';
import { PblNgridComponent } from '../../ngrid.component';
import { findCellDef } from '../../cell/cell-def/utils';
import {
  PblColumnFactory,
  PblColumnGroup, PblColumnGroupStore,
  isPblColumn, PblColumn, PblMetaColumn,
  PblNgridColumnDefinitionSet,
  PblNgridColumnSet,
  PblColumnSet,
  PblMetaRowDefinitions,
} from '../model';
import { StaticColumnWidthLogic } from '../width-logic/static-column-width';
import { resetColumnWidths } from '../../utils/helpers';
import { PblColumnStoreMetaRow, PblMetaColumnStore, PblRowColumnsChangeEvent, PblRowTypeToColumnTypeMap } from './types';
import { HiddenColumns } from './hidden-columns';
import { GridRowType } from '../../row/types';
import { PblNgridBaseRowComponent } from '../../row/base-row.component';

export interface PblMetaRowColumnsChangeEvent {
  metaRow: PblColumnStoreMetaRow;
  changes: IterableChanges<string>;
}

export class MetaRowsStore {
  headers: Array<PblColumnStoreMetaRow & { allKeys?: string[] }>;
  footers: Array<PblColumnStoreMetaRow & { allKeys?: string[] }>;

  readonly visibleChanged$ = new Subject<PblMetaRowColumnsChangeEvent>();

  private hDiffers: IterableDiffer<string>[] = [];
  private fDiffers: IterableDiffer<string>[] = [];

  constructor(private readonly differs: IterableDiffers) {
  }

  setHeader(value: PblColumnStoreMetaRow & { allKeys?: string[] }) {
    const index = value.rowDef.rowIndex;
    this.headers[index] = value;
    if (this.hDiffers[index]) {
      const diff = this.hDiffers[index].diff(value.keys);
      if (diff) {
        this.visibleChanged$.next({ metaRow: value, changes: diff });
      }
    } else {
      this.hDiffers[index] = this.differs.find([]).create<string>();
      this.hDiffers[index].diff(value.keys);
    }
  }

  setFooter(value: PblColumnStoreMetaRow & { allKeys?: string[] }) {
    const index = value.rowDef.rowIndex;
    this.footers[index] = value;
    if (this.fDiffers[index]) {
      const diff = this.fDiffers[index].diff(value.keys);
      if (diff) {
        this.visibleChanged$.next({ metaRow: value, changes: diff });
      }
    } else {
      this.fDiffers[index] = this.differs.find([]).create<string>();
      this.fDiffers[index].diff(value.keys);
    }
  }

  updateHeader(value: PblColumnStoreMetaRow & { allKeys?: string[] }): void {
    this.setHeader(Object.assign(this.headers[value.rowDef.rowIndex] || {}, value));
  }

  updateFooter(value: PblColumnStoreMetaRow & { allKeys?: string[] }): void {
    this.setFooter(Object.assign(this.footers[value.rowDef.rowIndex] || {}, value));
  }

  clear() {
    this.headers = [];
    this.footers = [];
  }
}
