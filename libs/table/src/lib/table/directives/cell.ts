import {
  Component,
  Directive,
  ElementRef,
  Input,
  KeyValueDiffers, KeyValueDiffer,
  OnDestroy,
  DoCheck,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { CdkColumnDef, CdkHeaderCell, CdkCell, CdkFooterCell } from '@angular/cdk/table';

import { SgTableComponent } from '../table.component';
import { COLUMN, SgColumn, SgColumnGroup } from '../columns';
import { _SgTableMetaCellTemplateContext } from '../pipes/table-cell-context.pipe';

/* TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

  SgTableColumnDef use's the default object KeyValueDiffer provides with angular.
  This differ will perform the diff on the entire object which IS NOT REQUIRED!
  We need to create a custom differ that does the diff on selected properties only.
*/
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[sgTableColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: SgTableColumnDef }
  ],
})
export class SgTableColumnDef extends CdkColumnDef implements DoCheck, OnDestroy {
  @Input('sgTableColumnDef') get column(): COLUMN { return this._column; };
  set column(value: COLUMN) {
    if (this._column !== value) {
      this._column = value;
      if (value) {
        this.name = value.id;
        value.columnDef = this;
        this.sticky = value.stickyStart;
        this.stickyEnd = value.stickyEnd;
      }
      if (this._colDiffer) {
        this.markForCheck();
      }
    }
  }

  get isDirty(): boolean {
    if (this._markedForCheck && !this._isDirty) {
      this._markedForCheck = false;
      this._isDirty = !!this._colDiffer.diff(this._column);
    }
    return this._isDirty;
  }

  protected _colDiffer: KeyValueDiffer<any, any>;
  private _column: COLUMN;
  private _isDirty: boolean = false;
  private _markedForCheck: boolean = false;

  constructor(protected readonly _differs: KeyValueDiffers) {
    super();
  }

  /**
   * Marks this column for a lazy change detection check.
   * Lazy means it will run the check only when the diff is requested (i.e. querying the `hasChanged` property).
   * This allow aggregation of changes between CD cycles, i.e. calling `markForCheck()` multiple times within the same CD cycle does not hit performance.
   *
   * Once marked for check, `sgTableColumnDef` handles it's dirty (`isDirty`) state automatically, when `isDirty` is true it will remain true until the
   * CD cycle ends, i.e. until `ngDoCheck()` hits. This means that only children of `sgTableColumnDef` can relay on `isDirty`, all children will run their
   * `ngDoCheck()` before `ngDoCheck()` of `sgTableColumnDef`.
   *
   * This is a how we notify all cell directives about changes in a column. It is done through angular's CD logic and does not require manual
   * CD kicks and special channels between sgTableColumnDef and it's children.
   */
  markForCheck(): void {
    if (!this._colDiffer) {
      this._colDiffer = this._differs.find({}).create();
      this._colDiffer.diff({});
    }
    this._markedForCheck = true;
  }

  /** @internal */
  ngDoCheck(): void {
    if (this._isDirty) {
      this._isDirty = false;
    }
  }

  /** @internal */
  ngOnDestroy(): void {
    if (this.column) {
      this.column.columnDef = undefined;
    }
  }
}


const HEADER_GROUP_CSS = `sg-header-group-cell`;
const HEADER_GROUP_PLACE_HOLDER_CSS = `sg-header-group-cell-placeholder`;

function setWidth(el: HTMLElement, column: COLUMN) {
  el.style.cssText = `min-width: ${column.cMinWidth}; width: ${column.cWidth}; max-width: ${column.cMaxWidth}; `;
}

function initCellElement(el: HTMLElement, column: COLUMN): void {
  setWidth(el, column);
  if (column.css) {
    const css = column.css.split(' ');
    for (const c of css) {
      el.classList.add(c);
    }
  }
}

/** Header cell template container that adds the right classes and role. */
@Component({
  selector: 'sg-table-header-cell',
  template: `<ng-container #vcRef></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SgTableHeaderCellDirective extends CdkHeaderCell implements DoCheck {
  @ViewChild('vcRef', { read: ViewContainerRef }) vcRef: ViewContainerRef;

  private el: HTMLElement;

  constructor(private columnDef: SgTableColumnDef,
              private table: SgTableComponent<any>,
              private cfr: ComponentFactoryResolver,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    const column = columnDef.column;
    const el = this.el = elementRef.nativeElement;
    const name = el.tagName.toLowerCase();
    el.classList.add(name);
    el.setAttribute('role', 'columnheader');

    if (column instanceof SgColumnGroup) {
      el.classList.add(HEADER_GROUP_CSS);
      if (column.placeholder) {
        el.classList.add(HEADER_GROUP_PLACE_HOLDER_CSS);
      }
    }
  }

  ngAfterViewInit(): void {
    const col = this.columnDef.column;
    const tpl = col instanceof SgColumn ? col.headerCellTpl : col.template;
    const view = this.vcRef.createEmbeddedView(tpl, new _SgTableMetaCellTemplateContext(col as any, this.table));
    if (col instanceof SgColumn && col.sort) {
      const SortComponent = this.table.registry.getSingle('sortContainer');
      if (SortComponent) {
        const factory = this.cfr.resolveComponentFactory(SortComponent);
        const sortView = this.vcRef.createComponent(factory, 0, null, [ view.rootNodes ]);
        sortView.instance.column = col;
      }
    }
    this.vcRef.get(0).detectChanges();
    initCellElement(this.el, col);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.column);
    }
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'sg-table-cell',
  host: {
    'class': 'sg-table-cell',
    'role': 'gridcell',
  },
})
export class SgTableCellDirective extends CdkCell implements DoCheck {
  private el: HTMLElement;

  constructor(private columnDef: SgTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    initCellElement(this.el, columnDef.column);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.column);
    }
  }
}

@Directive({ selector: 'sg-table-footer-cell' })
export class SgTableFooterCellDirective extends CdkFooterCell implements DoCheck {
  private el: HTMLElement;

  constructor(private columnDef: SgTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    const column = columnDef.column;
    const name = this.el.tagName.toLowerCase();
    this.el.classList.add(name);
    this.el.setAttribute('role', 'gridcell');
    initCellElement(this.el, column);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.column);
    }
  }
}
