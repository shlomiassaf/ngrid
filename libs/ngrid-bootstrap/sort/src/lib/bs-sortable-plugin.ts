import { Subject } from 'rxjs';
import { Directive, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ON_INVALIDATE_HEADERS, unrx } from '@pebula/ngrid/core';
import { PblNgridComponent, PblNgridPluginController, PblNgridSortDefinition, PblDataSource } from '@pebula/ngrid';
import { PblNgridSortable, PblNgridBsSortDirection, PblNgridBsSortState } from './types';
import { getSortDuplicateSortableIdError, getSortHeaderMissingIdError, getSortInvalidDirectionError } from './sort-errors';
import { PblNgridBsSortable } from './bs-sortable/bs-sortable.component';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    bsSortable?: PblNgridBsSortablePlugin;
  }
}
export const PLUGIN_KEY: 'bsSortable' = 'bsSortable';

@Directive({ selector: 'pbl-ngrid[bsSortable]', exportAs: 'pblBsSortable' })
export class PblNgridBsSortablePlugin implements OnChanges, OnDestroy {

  get bsSortableDisabled() { return this._disabled; }
  set bsSortableDisabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, PblNgridSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted MatSortable. */
  @Input('bsSortableActive') active: string;

  /**
   * The direction to set when an PblNgridSortable is initially sorted.
   * May be overriden by the PblNgridSortable's sort start.
   */
  @Input('bsSortableStart') start: 'asc' | 'desc' = 'asc';

  /** The sort direction of the currently active MatSortable. */
  @Input('bsSortableDirection') get direction(): PblNgridBsSortDirection { return this._direction; }
  set direction(direction: PblNgridBsSortDirection) {
    if (direction && direction !== 'asc' && direction !== 'desc' &&
      (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }

  @Input() bsArrowPosition: 'before' | 'after' = 'after';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the MatSortable's disable clear input.
   */
  @Input('matSortDisableClear')
  get disableClear(): boolean { return this._disableClear; }
  set disableClear(v: boolean) { this._disableClear = coerceBooleanProperty(v); }
  private _disableClear: boolean;

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('matSortChange') readonly sortChange: EventEmitter<PblNgridBsSortState> = new EventEmitter<PblNgridBsSortState>();

  private _direction: PblNgridBsSortDirection = '';
  private _disabled: boolean = false;
  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private origin: 'ds' | 'click' = 'click';

  constructor(public grid: PblNgridComponent<any>, private pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.sortChange
      .pipe(unrx(this))
      .subscribe( s => {
        this.onSort(s, this.origin);
        this.origin = 'click';
      });

    this.handleEvents();
  }

  /**
   * Register function to be used by the contained PblNgridSortable. Adds the PblNgridSortable to the
   * collection of PblNgridSortable.
   */
  register(sortable: PblNgridSortable): void {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!sortable.id) {
        throw getSortHeaderMissingIdError();
      }

      if (this.sortables.has(sortable.id)) {
        throw getSortDuplicateSortableIdError(sortable.id);
      }
    }

    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained PblNgridSortables. Removes the PblNgridSortable from the
   * collection of contained PblNgridSortables.
   */
  deregister(sortable: PblNgridSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: PblNgridSortable): void {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({active: this.active, direction: this.direction});
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: PblNgridSortable): PblNgridBsSortDirection {
    if (!sortable) { return ''; }

    // Get the sort direction cycle with the potential sortable overrides.
    const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
    let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) { nextDirectionIndex = 0; }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnChanges() {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._removePlugin(this.grid);
    unrx.kill(this);
  }

  private onSort(sort: PblNgridBsSortState, origin: 'ds' | 'click'): void {
    const table = this.grid;
    const column = table.columnApi.visibleColumns.find(c => c.id === sort.active);

    if ( origin !== 'click' || !column || !column.sort ) {
      return;
    } else {
      const newSort: PblNgridSortDefinition = { };
      const sortFn = typeof column.sort === 'function' && column.sort;
      if (sort.direction) {
        newSort.order = sort.direction;
      }
      if (sortFn) {
        newSort.sortFn = sortFn;
      }
      const currentSort = table.ds.sort;
      if (column === currentSort.column) {
        const _sort = currentSort.sort || {};
        if (newSort.order === _sort.order) {
          return;
        }
      }
      table.ds.setSort(column, newSort);
    }
  }

  private handleEvents() {
    const handleDataSourceSortChange = (sortChange: PblDataSource['sort']) => {
      const { column } = sortChange;
      const order = sortChange.sort ? sortChange.sort.order : undefined;

      if (column) {
        if (this.active === column.id && this.direction === (order || '')) { return; }
        const sortable: PblNgridSortable = this.sortables.get(column.id) as any;
        if (sortable) {
          this.origin = 'ds';
          this.active = undefined;
          sortable.start = order || 'asc';
          (sortable as PblNgridBsSortable)._handleClick();
        }
      } else if (this.active) { // clear mode (hit from code, not click).
        const sortable: PblNgridSortable = this.sortables.get(this.active) as any;
        if (sortable ) {
          if (!sortable.disableClear) {
            let nextSortDir: PblNgridBsSortDirection;
            while (nextSortDir = this.getNextSortDirection(sortable)) {
              this.direction = nextSortDir;
            }
          }
          this.origin = 'ds';
          (sortable as PblNgridBsSortable)._handleClick();
        }
      }
    }

    this.pluginCtrl.events
      .pipe(ON_INVALIDATE_HEADERS)
      .subscribe( e => {
        const hasActiveSort = this.active;
        if (this.grid.ds?.sort) {
          if (!this.grid.ds.sort.column && hasActiveSort) {
            this.onSort({ active: this.active, direction: this.direction || 'asc' }, this.origin);
          } else if (this.grid.ds.sort.column && !hasActiveSort) {
            setTimeout(() => handleDataSourceSortChange(this.grid.ds.sort));
          }
        }
      });

    this.pluginCtrl.events
      .subscribe( e => {
        if (e.kind === 'onDataSource') {
          unrx.kill(this, e.prev);
          if (this.active) {
            this.onSort({ active: this.active, direction: this.direction || 'asc' }, this.origin);
          }
          this.grid.ds.sortChange
            .pipe(unrx(this, e.curr))
            .subscribe( event => { handleDataSourceSortChange(event); });
        }
      });
  }

  static ngAcceptInputType_bsSortableDisabled: BooleanInput;
  static ngAcceptInputType_disableClear: BooleanInput;
}

function getSortDirectionCycle(start: 'asc' | 'desc',
                               disableClear: boolean): PblNgridBsSortDirection[] {
  let sortOrder: PblNgridBsSortDirection[] = ['asc', 'desc'];
  if (start == 'desc') { sortOrder.reverse(); }
  if (!disableClear) { sortOrder.push(''); }

  return sortOrder;
}
