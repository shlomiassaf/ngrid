import { ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Inject, Input, ViewEncapsulation, SimpleChanges, OnChanges, Optional, DoCheck, OnDestroy, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { CdkRow, RowContext } from '@angular/cdk/table';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridExtensionApi, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblRowContext } from '../context/index';
import { PblNgridComponent } from '../ngrid.component';
import { StylingDiffer, StylingDifferOptions } from './cell-style-class/styling_differ';
import { PblNgridCellDirective } from './cell';
import { PblColumn } from '../columns/column';
import { unrx } from '../utils/unrx';
import { moveItemInArrayExt } from '../column-management/column-store';

export const PBL_NGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content><ng-container #viewRef></ng-container><ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row[row]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-ngrid-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: PblNgridRowComponent }
  ],
  exportAs: 'pblNgridRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridRowComponent<T = any> extends CdkRow implements OnChanges, DoCheck, OnDestroy {

  @Input() set row(value: T) { value && this.updateRow(); }

  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;

  rowRenderIndex: number;
  context: PblRowContext<T>;

  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  private _classDiffer: StylingDiffer<{ [klass: string]: boolean }>;
  private _lastClass: Set<string>;
  private _extApi: PblNgridInternalExtensionApi<T>;
  private _cells: ComponentRef<PblNgridCellDirective>[] = [];

  constructor(@Optional() @Inject(EXT_API_TOKEN) extApi: PblNgridExtensionApi<T>,
              public readonly el: ElementRef<HTMLElement>) {
    super();
    if (extApi) {
      this.setGrid(extApi);
    }
  }

  updateRow(): void {
    if (this._extApi) {
      if (! (this.rowRenderIndex >= 0) ) {
        this.getRend();
      }
      this.context = this._extApi.contextApi.rowContext(this.rowRenderIndex);

      this.el.nativeElement.setAttribute('row-id', this.context.dataIndex as any);
      this.el.nativeElement.setAttribute('row-key', this.context.identity);

      if (this.grid?.rowClassUpdate && this.grid.rowClassUpdateFreq === 'item') {
        this.updateHostClass();
      }
    }
  }

  ngDoCheck(): void {
    if (this.grid) {
      if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'ngDoCheck') {
        this.updateHostClass();
      }
      for (const cell of this._cells) {
        // TODO: the cells are created through code which mean's that they don't belong
        // to the CD tree and we need to manually mark them for checking
        // We can customize the diffing, detect context changes internally and only trigger these cells which have changed!
        cell.instance.setContext(this.context);
        cell.changeDetectorRef.markForCheck();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._extApi) {
      if (!this.grid) {
        throw new Error('"pbl-ngrid-row" is used outside the scope of a grid, you must provide a grid instance.');
      }
      this.setGrid(PblNgridPluginController.find(this.grid).extApi);
      this.updateRow();
    }
  }

  ngAfterViewInit(): void {
    for (const c of this._extApi.columnApi.visibleColumns) {
      this.createCell(c);
    }
    this.ngDoCheck();
  }

  getRend(): void {
    const vcRef = this._extApi.cdkTable._rowOutlet.viewContainer;
    const len = vcRef.length - 1;
    for (let i = len; i > -1; i--) {
      const viewRef = vcRef.get(i) as EmbeddedViewRef<RowContext<T>>;
      if (viewRef.rootNodes[0] === this.el.nativeElement) {
        this.rowRenderIndex = i;
        break;
      }
    }
  }

  ngOnDestroy(): void {
    unrx.kill(this);
    this._extApi.rowsApi.removeRow(this);
  }

  protected setGrid(extApi?: PblNgridExtensionApi<T>) {
    this._extApi = extApi as PblNgridInternalExtensionApi<T>;
    this.grid = extApi.grid;
    this._extApi.rowsApi.addRow(this)
    this._extApi.columnStore.visibleChanged$
      .pipe(unrx(this))
      .subscribe( event => {
        event.changes.forEachOperation((record, previousIndex, currentIndex) => {
          if (record.previousIndex == null) {
            this.createCell(record.item, currentIndex);
          } else if (currentIndex == null) {
            this.destroyCell(record.item, true);
          } else {
            const cmp = this._cells.find( c => c.instance.column === record.item );
            if (cmp) {
              this._viewRef.move(cmp.hostView, currentIndex);
              moveItemInArrayExt(this._cells, previousIndex, currentIndex, (newVal, oldVal) => {
                newVal.instance.syncColumn();
                this.context.updateCell(oldVal.instance.cellCtx.clone(newVal.instance.column));
                newVal.changeDetectorRef.markForCheck();
              });
            }
          }
        });
      });
  }

  protected updateHostClass(): void {
    if (this.context) {
      const el = this.el.nativeElement;

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

  protected createCell(column: PblColumn, atIndex?: number) {
    const cell = this._viewRef.createComponent(this._extApi.rowsApi._factory, atIndex);
    this._cells.push(cell);
    cell.onDestroy(() => this.destroyCell(column));
    if (!column.columnDef) {
      cell.changeDetectorRef.detach();
      this._extApi.columnStore.columnDefObjectChanged$
        .pipe(unrx(this, column))
        .subscribe( event => {
          if (column === event.column && event.op === 'attach') {
            cell.changeDetectorRef.reattach();
            unrx.kill(this, column);
            cell.instance.setColumn(column);
            cell.instance.setContext(this.context);
          }
        });
    } else {
      cell.instance.setColumn(column);
      cell.instance.setContext(this.context);
    }

  }

  protected destroyCell(column: PblColumn, killView?: boolean) {
    const i = this._cells.findIndex( c => c.instance.column === column );
    if (i > -1) {
      unrx.kill(this, column);
      this._cells.slice(i, 1);
      if (killView) {
        const cmp = this._cells.find( c => c.instance.column === column );
        cmp.destroy();
      }
    }
  }
}
