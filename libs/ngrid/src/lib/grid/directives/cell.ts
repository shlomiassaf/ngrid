// tslint:disable:use-host-property-decorator
// tslint:disable:directive-selector
import { first, filter } from 'rxjs/operators';
import {
  OnInit,
  Component,
  Directive,
  ElementRef,
  DoCheck,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  NgZone,
  EmbeddedViewRef,
  Input,
} from '@angular/core';
import { CdkHeaderCell, CdkCell, CdkFooterCell } from '@angular/cdk/table';
import { UnRx } from '@pebula/utils';

import { PblNgridComponent } from '../ngrid.component';
import { uniqueColumnCss, uniqueColumnTypeCss, COLUMN_EDITABLE_CELL_CLASS } from '../circular-dep-bridge';
import { COLUMN, PblMetaColumn, PblColumn, PblColumnGroup, isPblColumn, isPblColumnGroup } from '../columns';
import { MetaCellContext, PblNgridMetaCellContext, PblRowContext, PblCellContext } from '../context/index';
import { PblNgridMultiRegistryMap } from '../services/grid-registry.service';
import { PblNgridColumnDef, WidthChangeEvent } from './column-def';
import { PblNgridDataHeaderExtensionContext, PblNgridMultiComponentRegistry, PblNgridMultiTemplateRegistry } from './registry.directives';

const HEADER_GROUP_CSS = `pbl-header-group-cell`;
const HEADER_GROUP_PLACE_HOLDER_CSS = `pbl-header-group-cell-placeholder`;

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

function initDataCellElement(el: HTMLElement, column: PblColumn): void {
  if (column.editable && column.editorTpl) {
    el.classList.add(COLUMN_EDITABLE_CELL_CLASS);
  }
}

const lastDataHeaderExtensions = new Map<PblNgridComponent<any>, PblNgridMultiRegistryMap['dataHeaderExtensions'][]>();

function applyWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applyWidth(this.el);
}

function applySourceWidth(this: { columnDef: PblNgridColumnDef; el: HTMLElement }) {
  this.columnDef.applySourceWidth(this.el);
}

/**
 * Header cell component.
 * The header cell component will render the header cell template and add the proper classes and role.
 *
 * It is also responsible for creating and managing the any `dataHeaderExtensions` registered in the registry.
 * These extensions add features to the cells either as a template instance or as a component instance.
 * Examples: Sorting behavior, drag&drop/resize handlers, menus etc...
 */
@Component({
  selector: 'pbl-ngrid-header-cell',
  host: {
    class: 'pbl-ngrid-header-cell',
    role: 'columnheader',
  },
  exportAs: 'ngridHeaderCell',
  template: `<ng-container #vcRef></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
@UnRx()
export class PblNgridHeaderCellComponent<T extends COLUMN = COLUMN> extends CdkHeaderCell implements OnInit {
  @ViewChild('vcRef', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  private el: HTMLElement;

  cellCtx: PblNgridDataHeaderExtensionContext | MetaCellContext;

  /** @deprecated use grid instead */
  readonly table: PblNgridComponent<T>;

  constructor(public readonly columnDef: PblNgridColumnDef<T>,
              public readonly grid: PblNgridComponent<any>,
              public readonly elementRef: ElementRef,
              private zone: NgZone) {
    super(columnDef, elementRef);
    this.table = grid;

    const column = columnDef.column;
    const el = this.el = elementRef.nativeElement;

    if (isPblColumnGroup(column)) {
      el.classList.add(HEADER_GROUP_CSS);
      if (column.placeholder) {
        el.classList.add(HEADER_GROUP_PLACE_HOLDER_CSS);
      }
    }
  }

  ngOnInit(): void {
    const col: COLUMN = this.columnDef.column;
    let predicate: (event: WidthChangeEvent) => boolean;
    let view: EmbeddedViewRef<PblNgridMetaCellContext<any, PblMetaColumn | PblColumn>>
    let widthUpdater: (...args: any[]) => void;

    if (isPblColumn(col)) {
      const gridWidthRow = this.el.parentElement.hasAttribute('gridWidthRow');
      widthUpdater = gridWidthRow ? applySourceWidth : applyWidth;
      predicate = event => (!gridWidthRow && event.reason !== 'update') || (gridWidthRow && event.reason !== 'resize');
      view = !gridWidthRow ? this.initMainHeaderColumnView(col) : undefined;
    } else {
      widthUpdater = applySourceWidth;
      predicate = event => event.reason !== 'resize';
      view = this.initMetaHeaderColumnView(col);
    }

    this.columnDef.widthChange
      .pipe(filter(predicate), UnRx(this))
      .subscribe(widthUpdater.bind(this));

    view && view.detectChanges();
    widthUpdater.call(this);
    initCellElement(this.el, col);
  }

  protected initMainHeaderColumnView(col: PblColumn) {
    this.cellCtx = PblNgridDataHeaderExtensionContext.createDateHeaderCtx(this as PblNgridHeaderCellComponent<PblColumn>, this.vcRef.injector);
    const context = this.cellCtx as PblNgridDataHeaderExtensionContext;
    const view = this.vcRef.createEmbeddedView(col.headerCellTpl, context);
    this.zone.onStable
      .pipe(first())
      .subscribe( () => {
        this.runHeaderExtensions(context, view as EmbeddedViewRef<PblNgridMetaCellContext<any, PblColumn>>);
        const v = this.vcRef.get(0);
        // at this point the view might get destroyed, its possible...
        if (!v.destroyed) {
          v.detectChanges();
        }
      });
    return view;
  }

  protected initMetaHeaderColumnView(col: PblMetaColumn | PblColumnGroup) {
    this.cellCtx = MetaCellContext.create(col, this.grid);
    return this.vcRef.createEmbeddedView(col.template, this.cellCtx);
  }

  protected runHeaderExtensions(context: PblNgridDataHeaderExtensionContext, view: EmbeddedViewRef<PblNgridMetaCellContext<any, PblColumn>>): void {
    // we collect the first header extension for each unique name only once per grid instance
    let extensions = lastDataHeaderExtensions.get(this.grid);
    if (!extensions) {
      const dataHeaderExtensions = new Map<string, any>();

      this.grid.registry.forMulti('dataHeaderExtensions', values => {
        for (const value of values) {
          if (!dataHeaderExtensions.has(value.name)) {
            dataHeaderExtensions.set(value.name, value);
          }
        }
      });

      extensions = Array.from(dataHeaderExtensions.values());
      lastDataHeaderExtensions.set(this.grid, extensions);
      // destroy it on the next turn, we know all cells will render on the same turn.
      this.zone.onStable.pipe(first()).subscribe( () => lastDataHeaderExtensions.delete(this.grid) );
    }

    let { rootNodes } = view;

    for (const ext of extensions) {
      if (!ext.shouldRender || ext.shouldRender(context)) {
        if (ext instanceof PblNgridMultiTemplateRegistry) {
          const extView = this.vcRef.createEmbeddedView(ext.tRef, context);
          extView.markForCheck();
        } else if (ext instanceof PblNgridMultiComponentRegistry) {
          rootNodes = this.createComponent(ext, context, rootNodes);
        }
      }
    }
  }

  protected createComponent(ext: PblNgridMultiComponentRegistry<any, "dataHeaderExtensions">, context: PblNgridDataHeaderExtensionContext, rootNodes: any[]): any[] {
    const factory = ext.getFactory(context);
    const projectedContent: any[][] = [];

    if (ext.projectContent) {
      projectedContent.push(rootNodes);
    }

    const cmpRef = this.vcRef.createComponent(factory, this.vcRef.length, null, projectedContent);

    if (ext.projectContent) {
      rootNodes = [ cmpRef.location.nativeElement ];
    }

    if (ext.onCreated) {
      ext.onCreated(context, cmpRef);
    }

    return rootNodes;
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'pbl-ngrid-cell',
  host: {
    'class': 'pbl-ngrid-cell',
    'role': 'gridcell',
  },
  exportAs: 'pblNgridCell',
})
@UnRx()
export class PblNgridCellDirective extends CdkCell implements DoCheck {

  @Input() set rowCtx(value: PblRowContext<any>) {
    if (value !== this._rowCtx) {
      this._rowCtx = value;
      this.ngDoCheck();
    }
  }

  private _rowCtx: PblRowContext<any>;
  cellCtx: PblCellContext | undefined;

  /**
   * The position of the column def among all columns regardless of visibility.
   */
  private colIndex: number;
  private el: HTMLElement;
  private focused = false;
  private selected = false;

  constructor(private colDef: PblNgridColumnDef<PblColumn>, elementRef: ElementRef) {
    super(colDef, elementRef);
    this.colIndex = this.colDef.grid.columnApi.indexOf(colDef.column as PblColumn);
    this.el = elementRef.nativeElement;
    colDef.applyWidth(this.el);
    initCellElement(this.el, colDef.column);
    initDataCellElement(this.el, colDef.column);


    /*  Apply width changes to this data cell
        We don't update "update" events because they are followed by a resize event which will update the absolute value (px) */
    colDef.widthChange
      .pipe(
        filter( event => event.reason !== 'update'),
        UnRx(this),
      )
      .subscribe(event => this.colDef.applyWidth(this.el));
  }

  ngDoCheck(): void {
    if (this._rowCtx) {
      const cellContext = this.cellCtx = this._rowCtx.cell(this.colIndex);

      if (cellContext.focused !== this.focused) {

        if (this.focused = cellContext.focused) {
          this.el.classList.add('pbl-ngrid-cell-focused');
        } else {
          this.el.classList.remove('pbl-ngrid-cell-focused');
        }
      }
      if (this.cellCtx.selected !== this.selected) {
        if (this.selected = cellContext.selected) {
          this.el.classList.add('pbl-ngrid-cell-selected');
        } else {
          this.el.classList.remove('pbl-ngrid-cell-selected');
        }
      }
    }
  }
}

@Directive({
  selector: 'pbl-ngrid-footer-cell',
  host: {
    'class': 'pbl-ngrid-footer-cell',
    'role': 'gridcell',
  },
  exportAs: 'ngridFooterCell',
 })
 @UnRx()
export class PblNgridFooterCellDirective extends CdkFooterCell implements OnInit {
  cellCtx: MetaCellContext;
  /** @deprecated use grid instead */
  readonly table: PblNgridComponent;

  private el: HTMLElement;
  constructor(private columnDef: PblNgridColumnDef<PblMetaColumn | PblColumnGroup>,
              public grid: PblNgridComponent,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    this.table = grid;
    this.el = elementRef.nativeElement;
    const column = columnDef.column;
    applyWidth.call(this);
    initCellElement(this.el, column);

    columnDef.widthChange
      .pipe(
        filter( event => event.reason !== 'update'),
        UnRx(this),
      )
      .subscribe(applyWidth.bind(this));
  }

  ngOnInit(): void {
    this.cellCtx = MetaCellContext.create(this.columnDef.column, this.grid);
  }
}
