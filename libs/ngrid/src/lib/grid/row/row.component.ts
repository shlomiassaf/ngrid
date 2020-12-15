import { ChangeDetectionStrategy, Component, ComponentRef, ViewChild, ViewContainerRef, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';

import { StylingDiffer, StylingDifferOptions, unrx } from '@pebula/ngrid/core';

import { PblRowContext } from '../context/index';
import { PblNgridCellComponent } from '../cell/cell.component';
import { PblColumn } from '../column/model';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { rowContextBridge } from './row-to-repeater-bridge';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

export const PBL_NGRID_ROW_TEMPLATE = '<ng-content select=".pbl-ngrid-row-prefix"></ng-content><ng-container #viewRef></ng-container><ng-content select=".pbl-ngrid-row-suffix"></ng-content>';

@Component({
  selector: 'pbl-ngrid-row[row]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-row pbl-ngrid-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: PblNgridRowComponent }
  ],
  exportAs: 'pblNgridRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridRowComponent<T = any> extends PblNgridBaseRowComponent<'data', T> implements OnInit, OnDestroy {

  @ViewChild('viewRef', { read: ViewContainerRef, static: true }) _viewRef: ViewContainerRef;

  readonly rowType = 'data' as const;

  get rowIndex(): number { return this._rowIndex; }
  /** Indicates if intersection observer is on, detecting outOfView state for us */
  private observerMode = true;

  context: PblRowContext<T>;

  protected prevRow: T | undefined;
  protected currRow: T | undefined;

  private _classDiffer: StylingDiffer<{ [klass: string]: true }>;
  private _lastClass: Set<string>;
  private _rowIndex: number;
  private outOfView = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.updateRow();
    // Doing nothing if IntersectionObserver is enable, otherwise updates the initial state
    this.updateOutOfView();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.context?.detachRow(this);
  }

  updateRow() {
    if (this.currRow !== this.context.$implicit) {
      this.prevRow = this.currRow;
      this.currRow = this.context.$implicit;

      if (this.currRow) {
        if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'item') {
          this.updateHostClass();
        }
        this.identityUpdated();
      }
      return true;
    }
    return false;
  }

  getCell(index: number): PblNgridCellComponent | undefined {
    return this._cells[index]?.instance;
  }

  getCellById(id: string): PblNgridCellComponent | undefined {
    const cellViewIndex = this._extApi.columnApi.renderIndexOf(id);
    return this._cells[cellViewIndex]?.instance;
  }

  /**
   * Rebuild the cells rendered.
   * This should be called when the columns have changed and new columns created in the column store.
   *
   * The new columns are new instances, clones of the previous columns and they DONT have a column definition!
   * This method will iterate over existing cells, updating each cell with the new column now in it's location and creating a column def for it.
   * If there are more cells rendered then in the store, it will remove those extra cells
   * If there are less cells rendered then in the store, it will create new ones.
   * This will ensure we don't create or remove cells unless we need to, saving on DOM operations.
   */
  _rebuildCells() {
    const columns = this._extApi.columnStore.getColumnsOf(this);
    this.context._rebuildCells(columns);
    const targetLen = columns.length;
    for (let i = 0; i < targetLen; i++) {
      const cellCmpRef = this._cells[i];
      if (!cellCmpRef) {
        this._createCell(columns[i]);
      } else {
        this.attachColumn(columns[i], cellCmpRef);
      }
    }

    let currentLen = this.cellsLength;
    while (currentLen > targetLen) {
      this._destroyCell(--currentLen);
    }

    this.detectChanges();

  }

  /**
   * Updates the outOfView state of this row and sync it with the context
   * If the context's state is different from the new outOfView state, will invoke a change detection cycle.
   * @internal
   */
  _setOutOfViewState(outOfView: boolean) {
    if (this.outOfView !== outOfView) {
      this.outOfView = outOfView;
      if (this.context?.outOfView !== outOfView) {
        this.context.outOfView = outOfView;
        // TODO: If scrolling, mark the row for check and update only after scroll is done
        this.ngDoCheck();
      }
    }
  }

  /**
   * Updates the `outOfView` flag of the context attached to this row
   *
   * This method is backward compatible to support browser without the IntersectionObservable API.
   *
   * If the browser DOES NOT support IntersectionObserver it will calculate the state using bounding rect APIs (force param has no effect, always true).
   * If the browser support IntersectionObserver it will do nothing when force is not set to true but when * set to true it will use
   * the IntersectionObserver `takeRecords` method to update the outOfView state.
   *
   * > NOTE that this method has a direct impact on performance as it uses DOM apis that trigger layout reflows.
   * Use with caution.
   */
  updateOutOfView(force?: boolean): void {
    if (!this.observerMode || force) {
      this._extApi.rowsApi.forceUpdateOutOfView(this);
    }
  }

  protected onCtor() {
    const { context, index } = rowContextBridge.bridgeRow(this);
    this.grid = context.grid;
    this._extApi = PblNgridPluginController.find(this.grid).extApi as PblNgridInternalExtensionApi<T>;
    this._rowIndex = index;
    this.context = context;
    this.context.attachRow(this);
  }

  protected detectChanges() {
    if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'ngDoCheck') {
      this.updateHostClass();
    }
    for (const cell of this._cells) {
      // TODO: the cells are created through code which mean's that they don't belong
      // to the CD tree and we need to manually mark them for checking
      // We can customize the diffing, detect context changes internally and only trigger these cells which have changed!
      cell.instance.setContext(this.context);
      cell.changeDetectorRef.detectChanges();
    }
  }

  protected updateHostClass(): void {
    const el = this.element;

    // if there is an updater, work with it
    // otherwise, clear previous classes that got applied (assumed a live binding change of the updater function)
    // users should be aware to tear down the updater only when they want to stop this feature, if the goal is just to toggle on/off
    // it's better to set the frequency to `none` and return nothing from the function (replace it) so the differ is not nuked.
    if (this.grid.rowClassUpdate) {
      if (!this._classDiffer) {
        this._classDiffer = new StylingDiffer<{ [klass: string]: true }>(
          'NgClass',
          StylingDifferOptions.TrimProperties | StylingDifferOptions.AllowSubKeys | StylingDifferOptions.AllowStringValue | StylingDifferOptions.ForceAsMap,
        );
        this._lastClass = new Set<string>();
      }

      const newValue = this.grid.rowClassUpdate(this.context);
      this._classDiffer.setInput(newValue);

      if (this._classDiffer.updateValue()) {
        const lastClass = this._lastClass;
        this._lastClass = new Set<string>();

        const value = this._classDiffer.value || {};

        for (const key of Object.keys(value)) {
          if (value[key]) {
            el.classList.add(key);
            this._lastClass.add(key);
          } else {
            el.classList.remove(key);
          }
          lastClass.delete(key);
        }
        if (lastClass.size > 0) {
          for (const key of lastClass.values()) {
            el.classList.remove(key);
          }
        }
      }
    } else if (this._classDiffer) {
      const value = this._classDiffer.value || {};
      this._classDiffer = this._lastClass = undefined;

      for (const key of Object.keys(value)) {
        el.classList.remove(key);
      }
    }
  }

  protected cellCreated(column: PblColumn, cell: ComponentRef<PblNgridCellComponent>) {
    this.attachColumn(column, cell);
  }

  protected cellDestroyed(cell: ComponentRef<PblNgridCellComponent>, previousIndex: number) {
    unrx.kill(this, cell.instance.column);
  }

  protected cellMoved(previousItem: ComponentRef<PblNgridCellComponent>, currentItem: ComponentRef<PblNgridCellComponent>, previousIndex: number, currentIndex: number) {
    currentItem.instance.syncColumn();
    this.context.updateCell(previousItem.instance.cellCtx.clone(currentItem.instance.column));
    currentItem.changeDetectorRef.markForCheck();
  }

  protected identityUpdated() {
    this.element.setAttribute('row-id', this.context.dsIndex as any);
    this.element.setAttribute('row-key', this.context.identity);
  }

  protected attachColumn(column: PblColumn, cell: ComponentRef<PblNgridCellComponent>) {
    if (!column.columnDef) {
      new PblNgridColumnDef(this._extApi).column = column;
      column.columnDef.name = column.id;
    }
    cell.instance.setColumn(column);
    cell.instance.setContext(this.context);
  }
}
