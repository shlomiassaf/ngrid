import { merge } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { unrx } from '@pebula/ngrid/core';
import { PblNgridBsSortablePlugin } from '../bs-sortable-plugin';
import { PblNgridBsSortDirection, PblNgridSortable } from '../types';

@Component({
  selector: 'pbl-bs-sortable',
  templateUrl: './bs-sortable.component.html',
  styleUrls: ['./bs-sortable.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': '_handleClick()',
  }
})
export class PblNgridBsSortable implements PblNgridSortable {

  id: string;

  /** Starting sort direction. */
  start: 'asc' | 'desc';

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;

  _direction: PblNgridBsSortDirection;

  constructor(cdRef: ChangeDetectorRef, private plugin: PblNgridBsSortablePlugin) {
    merge(plugin.sortChange, plugin._stateChanges)
        .subscribe(() => {
          if (this._isSorted()) {
            this._updateArrowDirection();
          }

          cdRef.markForCheck();
        });
  }

  ngOnInit() {
    // Initialize the direction of the arrow and set the view state to be immediately that state.
    this._updateArrowDirection();

    this.plugin.register(this);
  }

  ngOnDestroy() {
    this.plugin.deregister(this);
    unrx.kill(this);
  }

  _handleClick() {
    if (!this._isDisabled()) {
      this._toggleOnInteraction();
    }
  }
  _updateArrowDirection() {
    this._direction = this._isSorted()
      ? this.plugin.direction
      : (this.start || this.plugin.start)
    ;
  }

  _isAfter() {
    return this.plugin.bsArrowPosition === 'after';
  }

  /** Whether this PblNgridBsSortable is currently sorted in either ascending or descending order. */
  _isSorted() {
    return this.plugin.active == this.id && (this.plugin.direction === 'asc' || this.plugin.direction === 'desc');
  }

  _isDisabled() {
    return this.plugin.bsSortableDisabled; //|| this.disabled;
  }

  /** Triggers the sort on this sort header and removes the indicator hint. */
  _toggleOnInteraction() {

    this.plugin.sort(this);
  }
}
