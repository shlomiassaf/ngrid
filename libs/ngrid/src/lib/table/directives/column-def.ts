// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix
import {
  Directive,
  Input,
  Inject,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';

import { COLUMN } from '../columns';
import { isPblColumn } from '../columns/column';
import { PblNgridComponent } from '../table.component';
import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/table-ext-api';
import { uniqueColumnCss } from '../circular-dep-bridge';
import { widthBreakout } from '../col-width-logic/dynamic-column-width';
import { PblColumnSizeInfo } from '../types';

export type UpdateWidthReason = 'attach' | 'update' | 'resize';

export interface WidthChangeEvent {
  reason: UpdateWidthReason;
}

/**
 * Represents a runtime column definition for a user-defined column definitions.
 *
 * User defined column definitions are `PblColumn`, `PblMetaColumn`, `PblColumnGroup` etc...
 * They represent static column definitions and `PblNgridColumnDef` is the runtime instance of them.
 *
 */
@Directive({
  selector: '[pblNgridColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: PblNgridColumnDef },
    { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: PblNgridColumnDef }
  ],
})
export class PblNgridColumnDef<T extends COLUMN = COLUMN> extends CdkColumnDef implements OnDestroy {
  @Input('pblNgridColumnDef') get column(): T { return this._column; };
  set column(value: T) { this.attach(value); }

  /**
   * The complete width definition for the column.
   * There are 3 width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  get widths(): [string, string, string] { return this._widths; }

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  get netWidth(): number { return this._netWidth; }

  isDragging = false;

  table: PblNgridComponent<any>;

  /**
   * An event emitted when width of this column has changed.
   */
  @Output('pblNgridColumnDefWidthChange') widthChange = new EventEmitter<WidthChangeEvent>();

  private _column: T;

  /**
   * The complete width definition for the column.
   * There are 3 width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  private _widths: [string, string, string];

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  private _netWidth: number;

  private widthBreakout: (columnInfo: PblColumnSizeInfo) => ReturnType<typeof widthBreakout>;

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridExtensionApi<any>) {
    super();
    this.table = extApi.table;

    const s = extApi.dynamicColumnWidthFactory().strategy;
    this.widthBreakout = c => widthBreakout(s, c);
  }

  /**
   * Update the "widths" for this column and when width has changed.
   *
   * The "widths" are the 3 values representing a width of a cell: [minWidth, width, maxWidth],
   * this method is given the width and will calculate the minWidth and maxWidth based on the column definitions.
   *
   * If at least one value of "widths" has changed, fires the `widthChange` event with the `reason` provided.
   *
   * The reason can be used to optionally update the relevant cells, based on the source (reason) of the update.
   * - attach: This runtime column definition instance was attached to a static column definition instance.
   * - update: The width value was updated in the static column definition instance , which triggered a width update to the runtime column definition instance
   * - resize: A resize event to the header PblColumn cell was triggered, the width of the static column definition is not updated, only the runtime value is.
   *
   * Note that this updates the width of the column-def instance, not the column definitions width itself.
   * Only when `reason === 'update'` it means that the column definition was updated and triggered this update
   *
   * @param width The new width
   * @param reason The reason for this change
   */
  updateWidth(width: string, reason: UpdateWidthReason): void {
    const { isFixedWidth, parsedWidth } = this._column;

    /*  Setting the minimum width is based on the input.
        If the original width is pixel fixed we will take the maximum between it and the min width.
        If not, we will the take minWidth.
        If none of the above worked we will try to see if the current width is set with %, if so it will be our min width.
    */
    const minWidthPx = isFixedWidth
      ? Math.max(this._column.parsedWidth.value, this._column.minWidth || 0)
      : this._column.minWidth
    ;

    let minWidth = minWidthPx && `${minWidthPx}px`;
    if (!minWidth && parsedWidth && parsedWidth.type === '%') {
      minWidth = width;
    }

    const maxWidth = isFixedWidth
      ? Math.min(this._column.parsedWidth.value, this._column.maxWidth || this._column.parsedWidth.value)
      : this._column.maxWidth
    ;

    const prev = this._widths || [];
    this._widths = [minWidth || '',  width, maxWidth ? `${maxWidth}px` : width];

    // a previous 'resize' event will be followed by another 'resize' event with the same width, so fire....
    if (reason === 'resize') {
      this.widthChange.emit({ reason });
    } else {
      for (let i = 0; i < 3; i++) {
        if (prev[i] !== this._widths[i]) {
          this.widthChange.emit({ reason });
          break;
        }
      }
    }
  }

  /**
   * Apply the current width definitions (minWidth, width, maxWidth) onto the element.
   */
  applyWidth(element: HTMLElement): void { setWidth(element, this.widths); }

  /**
   * Query for cell elements related to this column definition.
   *
   * This query is not cached - cache in implementation.
   */
  queryCellElements(...filter: Array<'table' | 'header' | 'headerGroup' | 'footer' | 'footerGroup'>): HTMLElement[] {
    const cssId = `.${uniqueColumnCss(this)}`;

    const query: string[] = [];

    if (filter.length === 0) {
      query.push(cssId);
    } else {
      for (const f of filter) {
        switch (f) {
          case 'table':
           query.push(`.pbl-ngrid-cell${cssId}`);
           break;
          case 'header':
           query.push(`.pbl-ngrid-header-cell${cssId}:not(.pbl-header-group-cell)`);
           break;
          case 'headerGroup':
           query.push(`.pbl-header-group-cell${cssId}`);
           break;
          case 'footer':
           query.push(`.pbl-ngrid-footer-cell${cssId}:not(.pbl-footer-group-cell)`);
           break;
          case 'footerGroup':
           query.push(`.pbl-footer-group-cell${cssId}`);
           break;
        }
      }
    }
    // we query from the master table container and not CDKTable because of fixed meta rows
    return query.length === 0 ? [] : Array.from(this.extApi.element.querySelectorAll(query.join(', '))) as any;
  }

  /** @internal */
  ngOnDestroy(): void {
    this.detach();
    this.widthChange.complete();
  }

  onResize(): void {
    if (isPblColumn(this.column)) {
      const prevNetWidth = this._netWidth;
      this._netWidth = this.widthBreakout(this.column.sizeInfo).content;

      if (prevNetWidth !== this._netWidth) {
        const width = `${this._netWidth}px`;
        this.updateWidth(width, 'resize');
      }
    }
  }

  updatePin(pin?: 'start' | 'end'): void {
    this.sticky = this.stickyEnd = false;
    switch(pin) {
      case 'start':
        this.sticky = true;
        break;
      case 'end':
        this.stickyEnd = true;
        break;
    }
    if (this.table.isInit) {
      this.table._cdkTable.updateStickyColumnStyles();
    }
  }

  private attach(column: T): void {
    if (this._column !== column) {
      this.detach();
      if (column) {
        this._column = column;
        (column as any).attach(this);
        this.name = column.id.replace(/ /g, '_');

        if (isPblColumn(column)) {
          this.updatePin(column.pin);
        }
      }
    }
  }

  private detach(): void {
    if (this._column) {
      this._column.detach();
      this._column = undefined;
    }
  }
}

/**
 * Set the widths of an HTMLElement
 * @param el The element to set widths to
 * @param widths The widths, a tuple of 3 strings [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
 */
function setWidth(el: HTMLElement, widths: [string, string, string]) {
  el.style.minWidth = widths[0];
  el.style.width = widths[1];
  el.style.maxWidth = widths[2];

  // TODO(shlomiassaf)[perf, 4]: Instead of using a tuple for width, use a CSSStyleDeclaration object and just assign the props
  // This will avoid the additional check for %
  // We will need to implement it in all places that `_widths` is updated in `PblNgridColumnDef`
  // Another TODO is to cache the previous `boxSizing` in any case the column definition changes.

  // When the column does not have an explicit `minWidth` set and when the `width` is set explicitly to a % value
  // the logic in `PblNgridColumnDef.updateWidth` will set `minWidth` to the same value in `width`
  // This will cause an overflow unless we apply the border-box model
  if (widths[0] && widths[0].endsWith('%')) {
    el.style.boxSizing = 'border-box';
  } else {
    el.style.boxSizing = 'content-box';
  }
}
