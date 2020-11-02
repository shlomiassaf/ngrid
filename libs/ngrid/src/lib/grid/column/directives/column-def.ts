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

import { PblNgridComponent } from '../../ngrid.component';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../../ext/grid-ext-api';
import { uniqueColumnCss } from '../../utils/unique-column-css';
import { COLUMN, PblColumnSizeInfo, isPblColumn } from '../model';
import { widthBreakout } from '../width-logic/dynamic-column-width';

export type UpdateWidthReason = 'attach' | 'update' | 'resize';

export type WidthSet = [string, string, string];

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
   * The absolute width definitions, as currently set in the DOM (getBoundingClientRect()).
   * If no measurements exists yet, return the user defined width's.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  get widths(): WidthSet { return this._widths[1]; }

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  get netWidth(): number { return this._netWidth; }

  isDragging = false;

  readonly grid: PblNgridComponent<any>;

  /**
   * An event emitted when width of this column has changed.
   */
  @Output('pblNgridColumnDefWidthChange') widthChange = new EventEmitter<WidthChangeEvent>();

  private _column: T;

  /**
   * The complete width definition for the column.
   *
   * There are 2 width sets (tuple):
   * - [0]: The source width definitions as set in static column definition instance
   * - [1]: The absolute width definitions, as currently set in the DOM (getBoundingClientRect())
   *
   * Each set is made up of 3 primitive width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  private _widths: [WidthSet?, WidthSet?] = [];

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  private _netWidth: number;

  private widthBreakout: (columnInfo: PblColumnSizeInfo) => ReturnType<typeof widthBreakout>;

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi<any>) {
    super();
    this.grid = extApi.grid;

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

    const newWidths = [minWidth || '',  width, maxWidth ? `${maxWidth}px` : width] as WidthSet;
    if (reason === 'resize') {
      this._widths[1] = newWidths;
      this.widthChange.emit({ reason });
    } else {
      const prev = this._widths[0] || [];
      this._widths[0] = newWidths;
      if (!this._widths[1]) {
        this._widths[1] = newWidths;
      }
      for (let i = 0; i < 3; i++) {
        if (prev[i] !== newWidths[i]) {
          this.widthChange.emit({ reason });
          break;
        }
      }
    }
  }

  /**
   * Apply the current absolute width definitions (minWidth, width, maxWidth) onto an element.
   */
  applyWidth(element: HTMLElement): void { setWidth(element, this.widths); }

  /**
   * Apply the source width definitions )set in static column definition instance) onto an element.
   */
  applySourceWidth(element: HTMLElement): void { setWidth(element, this._widths[0]); }

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
    if (this.grid.isInit) {
      this.extApi.cdkTable.updateStickyColumnStyles();
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
      const col = this._column;
      this._column = undefined;
      col.detach();
    }
  }
}

/**
 * Set the widths of an HTMLElement
 * @param el The element to set widths to
 * @param widths The widths, a tuple of 3 strings [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
 */
function setWidth(el: HTMLElement, widths: WidthSet) {
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
