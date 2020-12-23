import {
  AfterViewInit, ChangeDetectorRef, Injector, OnInit,
  Directive,
  ElementRef,
  Optional,
  DoCheck,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
} from '@angular/core';
import { unrx } from '@pebula/ngrid/core';

import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridComponent } from '../ngrid.component';
import { moveItemInArrayExt } from '../column/management/column-store';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';
import { PblRowTypeToColumnTypeMap } from '../column/management';

export const PBL_NGRID_BASE_ROW_TEMPLATE  = `<ng-container #viewRef></ng-container>`;

// tslint:disable-next-line: no-conflicting-lifecycle
@Directive()
export abstract class PblNgridBaseRowComponent<TRowType extends GridRowType, T = any> implements OnInit, DoCheck, AfterViewInit, OnDestroy {

  grid: PblNgridComponent<T>;

  @ViewChild('viewRef', { read: ViewContainerRef, static: true }) _viewRef: ViewContainerRef;

  readonly element: HTMLElement;

  get height() {
    return this.element.getBoundingClientRect().height;
  }

  get cellsLength() { return this._cells.length; }

  /**
   * An attached row will run change detection on it's children.
   * All rows are attached by default.
   */
  get attached(): boolean { return this._attached; }

  abstract readonly rowType: TRowType;

  abstract get rowIndex(): number;

  protected _extApi: PblNgridInternalExtensionApi<T>;
  protected _cells: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>[] = [];

  protected cellInjector: Injector;

  private _attached = true;

  constructor(@Optional() grid: PblNgridComponent<T>,
              readonly cdRef: ChangeDetectorRef,
              elementRef: ElementRef<HTMLElement>) {
    this.element = elementRef.nativeElement;
    if (grid) {
      this.grid = grid;
    }
    this.onCtor();
  }

  ngOnInit() {
    if (!this.grid) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`When a grid row is used outside the scope of a grid, you must provide the grid instance.`);
      }
    }
    this.resolveTokens();
    this.element.setAttribute('data-rowtype', this.rowType);
    this._extApi.rowsApi.addRow(this)
  }

  ngAfterViewInit(): void {
    for (const c of this._extApi.columnStore.getColumnsOf(this)) {
      this._createCell(c);
    }
    this.detectChanges();
  }

  ngDoCheck(): void {
    if (this._attached && this.grid) {
      this.detectChanges();
    }
  }

  ngOnDestroy(): void {
    unrx.kill(this);
    this._extApi?.rowsApi.removeRow(this);
  }

  /**
   * Marks the row as attached.
   * Rows are attached by default.
   * An attached row takes part in the change detection process
   */
  _attach(): boolean {
    if (!this._attached) {
      this._attached = true;
      return true;
    }
    return false;
  }

  /**
   * Marks the row as detached.
   * A detached row DOWS NOT take part in the change detection process.
   *
   * Usually when the rendering engine cache row elements for performance, these should be detached when cached and re-attached when returned into view.
   */
  _detach(): boolean {
    if (this._attached) {
      this._attached = false;
      return true;
    }
    return false;
  }

  _createCell(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number) {
    if (!this.canCreateCell || this.canCreateCell(column, atIndex)) {
      const cell = this.createComponent(column, atIndex);
      cell.instance.setOwner(this);
      if (this.cellCreated) {
        this.cellCreated(column, cell);
      }
    }
  }

  _destroyCell(cellOrCellIndex: number | ComponentRef<PblRowTypeToCellTypeMap<TRowType>>) {
    const cell = typeof cellOrCellIndex === 'number' ? this._cells[cellOrCellIndex] : cellOrCellIndex;
    if (cell) {
      const index = this._cells.indexOf(cell);
      if (!this.canDestroyCell || this.canDestroyCell(cell)) {
        this._viewRef.remove(index);
        this._cells.splice(index, 1);
        if (this.cellDestroyed) {
          this.cellDestroyed(cell, index);
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

  protected abstract detectChanges();
  protected abstract onCtor();

  protected canCreateCell?(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number): boolean;
  protected canDestroyCell?(cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>): boolean;
  protected canMoveCell?(fromIndex: number, toIndex: number, cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>): boolean;
  protected cellCreated?(column: PblRowTypeToColumnTypeMap<TRowType>, cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>);
  protected cellDestroyed?(cell: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>, previousIndex: number);
  protected cellMoved?(previousItem: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>, currentItem: ComponentRef<PblRowTypeToCellTypeMap<TRowType>>, previousIndex: number, currentIndex: number);

  protected createComponent(column: PblRowTypeToColumnTypeMap<TRowType>, atIndex?: number) {
    const viewRefLength = this._viewRef.length;
    if (!atIndex && atIndex !== 0) {
      atIndex = viewRefLength;
    }
    atIndex = Math.min(viewRefLength, atIndex);
    const cell = this._viewRef.createComponent(this._extApi.rowsApi.cellFactory.getComponentFactory(this), atIndex, this.cellInjector);
    this._cells.splice(atIndex, 0, cell);
    cell.onDestroy(() => this._cells.splice(this._cells.indexOf(cell), 1));
    return cell;
  }

  /**
   * Resolves the extensions API and the injector to be used when creating cells.
   */
  protected resolveTokens() {
    // The cells require the extApi and grid to live on the DI tree.
    // In the case of row it might not be there since the row is defined outside of the grid somewhere
    // Row's are defined view templates so their DI tree depended on their location hence we need to verify
    // that we can get the extApi from the viewRef's injector, if so, great if not we need to extend the injector we use
    // to build cells.
    const injector = this._viewRef?.injector;

    const extApi = injector?.get<PblNgridInternalExtensionApi<T>>(EXT_API_TOKEN, null);
    if (!extApi) {
      // _extApi might be here already...
      this._extApi = this._extApi || PblNgridPluginController.find(this.grid).extApi as PblNgridInternalExtensionApi<T>;
      this.cellInjector = Injector.create({
        providers: [
          { provide: PblNgridComponent, useValue: this.grid },
          { provide: EXT_API_TOKEN, useValue: this._extApi },
        ],
        parent: injector,
      });
    } else {
      this._extApi = this._extApi || extApi;
      this.cellInjector = injector;
    }
  }

}
