import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, ViewEncapsulation, SimpleChanges, OnChanges, Optional, DoCheck, OnDestroy, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';

import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridExtensionApi, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridComponent } from '../ngrid.component';
import { unrx } from '../utils/unrx';
import { moveItemInArrayExt } from '../column/management/column-store';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';
import { PblRowTypeToColumnTypeMap } from '../column/management';

export const PBL_NGRID_BASE_ROW_TEMPLATE  = `<ng-container #viewRef></ng-container>`;

@Component({
  template: PBL_NGRID_BASE_ROW_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export abstract class PblNgridBaseRowComponent<TRowType extends GridRowType, T = any> implements OnChanges, DoCheck, OnDestroy {

  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;

  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  get rowType(): TRowType { return this.getRowType(); }

  protected _extApi: PblNgridInternalExtensionApi<T>;
  protected _cells: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>[] = [];

  constructor(@Optional() @Inject(EXT_API_TOKEN) extApi: PblNgridExtensionApi<T>,
              public readonly el: ElementRef<HTMLElement>) {
    if (extApi) {
      this._init(extApi, true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._extApi) {
      if (!this.grid) {
        throw new Error('"pbl-ngrid-row" is used outside the scope of a grid, you must provide a grid instance.');
      }
      this._init(PblNgridPluginController.find(this.grid).extApi, false);
    }
  }

  ngAfterViewInit(): void {
    if (this.grid) {
      for (const c of this._extApi.columnStore.getColumnsOf(this)) {
        this._createCell(c);
      }
      this.detectChanges();
    }
  }

  ngDoCheck(): void {
    if (this.grid) {
      this.detectChanges();
    }
  }

  ngOnDestroy(): void {
    unrx.kill(this);
    this._extApi.rowsApi.removeRow(this);
  }

  _createCell(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number) {
    if (!this.canCreateCell || this.canCreateCell(column, atIndex)) {
      const cell = this.createComponent(column, atIndex);
      if (this.cellCreated) {
        this.cellCreated(column, cell);
      }
    }
  }

  _destroyCell(cellOrCellIndex: number | ComponentRef<PblRowTypeToCellTypeMap<TRowType>>) {
    const cell = typeof cellOrCellIndex === 'number' ? this._cells[cellOrCellIndex] : cellOrCellIndex;
    if (cell) {
      if (!this.canDestroyCell || this.canDestroyCell(cell)) {
        cell.destroy();
        if (this.cellDestroyed) {
          this.cellDestroyed(cell);
        }
      }
    }
  }

  _moveCell(fromIndex: number, toIndex: number) {
    const cmp = this._cells[fromIndex];
    if (cmp) {
      if (!this.canMoveCell || this.canMoveCell(fromIndex, toIndex, cmp)) {
        this._viewRef.move(cmp.hostView, toIndex);
        moveItemInArrayExt(this._cells, fromIndex, toIndex, (previousItem, currentItem, previousIndex, currentIndex) => {
          if (this.cellMoved) {
            this.cellMoved(previousItem, currentItem, previousIndex, currentIndex);
          }
        });
      }
    }
  }

  protected abstract getRowType(): TRowType;

  protected abstract init(initAtConstructor: boolean);

  protected abstract detectChanges();

  protected canCreateCell?(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number): boolean;
  protected canDestroyCell?(cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>): boolean;
  protected canMoveCell?(fromIndex: number, toIndex: number, cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>): boolean;
  protected cellCreated?(column: PblRowTypeToColumnTypeMap<TRowType>, cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>);
  protected cellDestroyed?(cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>);
  protected cellMoved?(previousItem: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>, currentItem: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>, previousIndex: number, currentIndex: number);

  protected createComponent(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number) {
    const viewRefLength = this._viewRef.length;
    if (!atIndex && atIndex !== 0) {
      atIndex = viewRefLength;
    }
    const cell = this._viewRef.createComponent(this._extApi.rowsApi.cellFactory.getComponentFactory(this), Math.min(viewRefLength, atIndex));
    this._cells.push(cell);
    cell.onDestroy(() => this._cells.splice(this._cells.indexOf(cell), 1));
    return cell;
  }

  private _init(extApi: PblNgridExtensionApi<T>, initAtConstructor: boolean) {
    this._extApi = extApi as PblNgridInternalExtensionApi<T>;
    this.grid = extApi.grid;
    this.init(initAtConstructor)
    this._extApi.rowsApi.addRow(this)
    this.el.nativeElement.setAttribute('data-rowtype', this.rowType);
  }
}
