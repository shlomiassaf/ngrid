import { ChangeDetectionStrategy, Component, ComponentRef, EmbeddedViewRef, Input, ViewChild, ViewContainerRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CdkRow, RowContext } from '@angular/cdk/table';

import { PblRowContext } from '../context/index';
import { StylingDiffer, StylingDifferOptions } from '../utils/styling.differ';
import { PblNgridCellComponent } from '../cell/cell.component';
import { PblColumn } from '../column/model';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent } from './base-row.component';
import { PblNgridComponent } from '../ngrid.component';
import { PblNgridColumnDef } from '../column/directives/column-def';

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
export class PblNgridRowComponent<T = any> extends PblNgridBaseRowComponent<'data', T> implements OnDestroy {

  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;

  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  readonly rowType = 'data' as const;

  get rowIndex(): number { return this._rowIndex; }

  @Input() set row(value: T) {
    this.updateRow();
    if (this.context) {
      this.identityUpdated();
    }
  }

  context: PblRowContext<T>;

  private _classDiffer: StylingDiffer<{ [klass: string]: boolean }>;
  private _lastClass: Set<string>;
  private _rowIndex: number;

  updateRow(): void {
    if (this._extApi) {

      if (!this.context) {
        const vcRef = this._extApi.cdkTable._rowOutlet.viewContainer;
        const len = vcRef.length - 1;
        for (let i = len; i > -1; i--) {
          const viewRef = vcRef.get(i) as EmbeddedViewRef<PblRowContext<T>>;
          if (viewRef.rootNodes[0] === this.element) {
            this._rowIndex = i;
            this.context = viewRef.context;
            this.context.attachRow(this);
            break;
          }
        }

        this.identityUpdated();

        if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'item') {
          this.updateHostClass();
        }
      }
    }
  }

  getCell(index: number): PblNgridCellComponent | undefined {
    return this._cells[index]?.instance;
  }

  getCellById(id: string): PblNgridCellComponent | undefined {
    const cellViewIndex = this._extApi.columnApi.renderIndexOf(id);
    return this._cells[cellViewIndex]?.instance;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.context?.detachRow(this);
  }

  protected init() {
    this.updateRow();
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
    if (this.context) {
      const el = this.element;

      // if there is an updater, work with it
      // otherwise, clear previous classes that got applied (assumed a live binding change of the updater function)
      // users should be aware to tear down the updater only when they want to stop this feature, if the goal is just to toggle on/off
      // it's better to set the frequency to `none` and return nothing from the function (replace it) so the differ is not nuked.
      if (this.grid.rowClassUpdate) {
        if (!this._classDiffer) {
          this._classDiffer = new StylingDiffer<{ [klass: string]: boolean }>(
            'NgClass',
            StylingDifferOptions.TrimProperties | StylingDifferOptions.AllowSubKeys | StylingDifferOptions.AllowStringValue | StylingDifferOptions.ForceAsMap,
          );
          this._lastClass = new Set<string>();
        }

        const newValue = this.grid.rowClassUpdate(this.context);
        this._classDiffer.setValue(newValue);

        if (this._classDiffer.hasValueChanged()) {
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
  }

  protected cellCreated(column: PblColumn, cell: ComponentRef<PblNgridCellComponent>) {
    if (!column.columnDef) {
      new PblNgridColumnDef(this._extApi).column = column;
      column.columnDef.name = column.id;
    }
    cell.instance.setColumn(column);
    cell.instance.setContext(this.context);
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
}
