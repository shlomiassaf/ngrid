// tslint:disable:use-host-property-decorator
// tslint:disable:directive-selector
import { first } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  DoCheck,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  NgZone,
} from '@angular/core';
import { CdkHeaderCell, CdkCell, CdkFooterCell } from '@angular/cdk/table';

import { NegTableComponent } from '../table.component';
import { uniqueColumnCss, uniqueColumnTypeCss, COLUMN_EDITABLE_CELL_CLASS } from '../circular-dep-bridge';
import { COLUMN, NegColumn, NegColumnGroup } from '../columns';
import { MetaCellContext } from '../context';
import { NegTableMultiRegistryMap } from '../services/table-registry.service';
import { NegTableColumnDef } from './column-def';

const HEADER_GROUP_CSS = `neg-header-group-cell`;
const HEADER_GROUP_PLACE_HOLDER_CSS = `neg-header-group-cell-placeholder`;

function initCellElement(el: HTMLElement, column: COLUMN): void {
  el.classList.add(uniqueColumnCss(column.columnDef));
  if (column.type) {
    el.classList.add(uniqueColumnTypeCss(column.type));
  }
  if (column.css) {
    const css = column.css.split(' ');
    for (const c of css) {
      el.classList.add(c);
    }
  }
}

function initDataCellElement(el: HTMLElement, column: NegColumn): void {
  if (column.editable && column.editorTpl) {
    el.classList.add(COLUMN_EDITABLE_CELL_CLASS);
  }
}

const lastDataHeaderExtensions = new Map<NegTableComponent<any>, NegTableMultiRegistryMap['dataHeaderExtensions'][]>();

/** Header cell template container that adds the right classes and role. */
@Component({
  selector: 'neg-table-header-cell',
  host: {
    class: 'neg-table-header-cell',
    role: 'columnheader',
  },
  template: `<ng-container #vcRef></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NegTableHeaderCellComponent extends CdkHeaderCell implements DoCheck, AfterViewInit {
  @ViewChild('vcRef', { read: ViewContainerRef }) vcRef: ViewContainerRef;

  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef,
              public table: NegTableComponent<any>,
              private cfr: ComponentFactoryResolver, private zone: NgZone,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    const column = columnDef.column;
    const el = this.el = elementRef.nativeElement;

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
    const context = new MetaCellContext(col as any, this.table);
    const view = this.vcRef.createEmbeddedView(tpl, context);

    this.vcRef.get(0).detectChanges();
    this.columnDef.applyWidth(this.el);
    initCellElement(this.el, col);

    if (col instanceof NegColumn) {
      this.zone.onStable.pipe(first()).subscribe( () => {

        // we collect the first header extension for each unique name only once per table instance
        let extensions = lastDataHeaderExtensions.get(this.table);
        if (!extensions) {
          const dataHeaderExtensions = new Map<string, any>();
          let registry = this.table.registry;
          while (registry) {
            const values = registry.getMulti('dataHeaderExtensions');
            if (values) {
              for (const value of values) {
                if (!dataHeaderExtensions.has(value.name)) {
                  dataHeaderExtensions.set(value.name, value);
                }
              }
            }
            registry = registry.parent;
          }
          extensions = Array.from(dataHeaderExtensions.values());
          lastDataHeaderExtensions.set(this.table, extensions);
          // destroy it on the next turn, we know all cells will render on the same turn.
          this.zone.onStable.pipe(first()).subscribe( () => lastDataHeaderExtensions.delete(this.table) );
        }

        for (const ext of extensions) {
          if (!ext.shouldRender || ext.shouldRender(context)) {
            const extView = this.vcRef.createEmbeddedView(ext.tRef, context);
            extView.markForCheck();
          }
        }

        if (col.sort) {
          const SortComponent = this.table.registry.getSingle('sortContainer');
          if (SortComponent) {
            const factory = this.cfr.resolveComponentFactory(SortComponent);
            const sortView = this.vcRef.createComponent(factory, 0, null, [ view.rootNodes ]);
            sortView.instance.column = col;
            sortView.changeDetectorRef.markForCheck();
          }
        }
        this.vcRef.get(0).detectChanges();
      });
    }
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      this.columnDef.applyWidth(this.el);
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
  exportAs: 'negTableCell',
})
export class NegTableCellDirective extends CdkCell implements DoCheck {

  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    columnDef.applyWidth(this.el);
    initCellElement(this.el, columnDef.column);
    initDataCellElement(this.el, columnDef.column as NegColumn);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      this.columnDef.applyWidth(this.el);
    }
  }
}

@Directive({
  selector: 'neg-table-footer-cell',
  host: {
    'class': 'neg-table-footer-cell',
    'role': 'gridcell',
  },
 })
export class NegTableFooterCellDirective extends CdkFooterCell implements DoCheck {
  private el: HTMLElement;

  constructor(private columnDef: NegTableColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.el = elementRef.nativeElement;
    const column = columnDef.column;
    columnDef.applyWidth(this.el);
    initCellElement(this.el, column);
  }

  // TODO: smart diff handling... handle all diffs, not just width, and change only when required.
  ngDoCheck(): void {
    if (this.columnDef.isDirty) {
      this.columnDef.applyWidth(this.el);
    }
  }
}
