// tslint:disable:use-host-property-decorator
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  DoCheck,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { CdkHeaderCell, CdkCell, CdkFooterCell } from '@angular/cdk/table';

import { NegTableComponent } from '../table.component';
import { COLUMN, NegColumn, NegColumnGroup } from '../columns';
import { _NegTableMetaCellTemplateContext } from '../pipes/table-cell-context.pipe';
import { NegTableColumnDef } from './column-def';

const HEADER_GROUP_CSS = `neg-header-group-cell`;
const HEADER_GROUP_PLACE_HOLDER_CSS = `neg-header-group-cell-placeholder`;

/**
 * Set the widths of an HTMLElement
 * @param el The element to set widths to
 * @param widths The widths, a tuple of 3 strings [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
 */
function setWidth(el: HTMLElement, widths: [string, string, string]) {
  el.style.cssText = `min-width: ${widths[0]}; width: ${widths[1]}; max-width: ${widths[2]}; `;
}

function initCellElement(el: HTMLElement, column: COLUMN): void {
  if (column.css) {
    const css = column.css.split(' ');
    for (const c of css) {
      el.classList.add(c);
    }
  }
}

/** Header cell template container that adds the right classes and role. */
@Component({
  selector: 'neg-table-header-cell',
  template: `<ng-container #vcRef></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NegTableHeaderCellComponent extends CdkHeaderCell implements DoCheck, AfterViewInit {
  @ViewChild('vcRef', { read: ViewContainerRef }) vcRef: ViewContainerRef;

  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef,
              private table: NegTableComponent<any>,
              private cfr: ComponentFactoryResolver,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    const column = columnDef.column;
    const el = this.el = elementRef.nativeElement;
    const name = el.tagName.toLowerCase();
    el.classList.add(name);
    el.setAttribute('role', 'columnheader');

    if (column instanceof NegColumnGroup) {
      el.classList.add(HEADER_GROUP_CSS);
      if (column.placeholder) {
        el.classList.add(HEADER_GROUP_PLACE_HOLDER_CSS);
      }
    }
  }

  ngAfterViewInit(): void {
    const col = this.columnDef.column;
    const tpl = col instanceof NegColumn ? col.headerCellTpl : col.template;
    const view = this.vcRef.createEmbeddedView(tpl, new _NegTableMetaCellTemplateContext(col as any, this.table));
    if (col instanceof NegColumn && col.sort) {
      const SortComponent = this.table.registry.getSingle('sortContainer');
      if (SortComponent) {
        const factory = this.cfr.resolveComponentFactory(SortComponent);
        const sortView = this.vcRef.createComponent(factory, 0, null, [ view.rootNodes ]);
        sortView.instance.column = col;
      }
    }
    this.vcRef.get(0).detectChanges();
    setWidth(this.el, this.columnDef.widths);
    initCellElement(this.el, col);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.widths);
    }
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'neg-table-cell',
  host: {
    'class': 'neg-table-cell',
    'role': 'gridcell',
  },
})
export class NegTableCellDirective extends CdkCell implements DoCheck {
  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    setWidth(this.el, columnDef.widths);
    initCellElement(this.el, columnDef.column);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.widths);
    }
  }
}

@Directive({ selector: 'neg-table-footer-cell' })
export class NegTableFooterCellDirective extends CdkFooterCell implements DoCheck {
  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    const column = columnDef.column;
    const name = this.el.tagName.toLowerCase();
    this.el.classList.add(name);
    this.el.setAttribute('role', 'gridcell');
    setWidth(this.el, columnDef.widths);
    initCellElement(this.el, column);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      setWidth(this.el, this.columnDef.widths);
    }
  }
}
