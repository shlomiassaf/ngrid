// tslint:disable:use-host-property-decorator
// tslint:disable:directive-selector
import { first, filter } from 'rxjs/operators';
import {
  Optional,
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  NgZone,
  EmbeddedViewRef,
  Inject,
} from '@angular/core';

import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { unrx } from '../utils';
import { PblNgridComponent } from '../ngrid.component';
import { COLUMN, PblMetaColumn, PblColumn, PblColumnGroup, isPblColumn, isPblColumnGroup } from '../column/model';
import { MetaCellContext, PblNgridMetaCellContext } from '../context/index';
import { PblNgridMultiRegistryMap, PblNgridDataHeaderExtensionContext, PblNgridMultiComponentRegistry, PblNgridMultiTemplateRegistry } from '../registry';
import { PblNgridColumnDef, WidthChangeEvent } from '../column/directives/column-def';
import { applySourceWidth, applyWidth, initCellElement } from './utils';
import { PblNgridBaseCell } from './base-cell';
import { PblColumnSizeObserver } from '../features/column-size-observer/column-size-observer.directive';

const lastDataHeaderExtensions = new Map<PblNgridComponent<any>, PblNgridMultiRegistryMap['dataHeaderExtensions'][]>();

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
    class: 'cdk-header-cell pbl-ngrid-header-cell',
    role: 'columnheader',
  },
  exportAs: 'ngridHeaderCell',
  template: `<ng-container #vcRef></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridHeaderCellComponent<T extends COLUMN = COLUMN> extends PblNgridBaseCell {
  @ViewChild('vcRef', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  column: PblColumn;
  cellCtx: PblNgridDataHeaderExtensionContext | MetaCellContext;

  get columnDef(): PblNgridColumnDef<PblColumn> { return this.column?.columnDef; }
  get grid(): PblNgridComponent { return this.extApi.grid; }

  private resizeObserver: PblColumnSizeObserver;

  constructor(@Optional() @Inject(EXT_API_TOKEN) private extApi: PblNgridInternalExtensionApi,
              elementRef: ElementRef,
              private zone: NgZone) {
    super(elementRef);
  }

  setColumn(column: PblColumn) {
    const prev = this.column;
    if (prev !== column) {
      if (prev) {
        unrx.kill(this, prev);
      }

      this.column = column;

      if (!column.columnDef) {
        new PblNgridColumnDef(this.extApi).column = column;
        column.columnDef.name = column.id;
      }

      let predicate: (event: WidthChangeEvent) => boolean;
      let view: EmbeddedViewRef<PblNgridMetaCellContext<any, PblMetaColumn | PblColumn>>
      let widthUpdater: (...args: any[]) => void;

      const gridWidthRow = this.el.parentElement.hasAttribute('gridWidthRow');
      widthUpdater = gridWidthRow ? applySourceWidth : applyWidth;
      predicate = event => (!gridWidthRow && event.reason !== 'update') || (gridWidthRow && event.reason !== 'resize');
      view = !gridWidthRow ? this.initMainHeaderColumnView(column) : undefined;
      if (gridWidthRow && !this.resizeObserver) {
        this.resizeObserver = new PblColumnSizeObserver({ nativeElement: this.el }, this.extApi.grid);
        this.resizeObserver.updateSize();
      }

      this.columnDef.widthChange
        .pipe(filter(predicate), unrx(this, column))
        .subscribe(widthUpdater.bind(this));

      view && view.detectChanges();
      widthUpdater.call(this);
      initCellElement(this.el, column);
    }
  }

  ngAfterViewInit() {
    if (this.resizeObserver) {
      this.resizeObserver.column = this.column;
      this.resizeObserver.ngAfterViewInit();
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.ngOnDestroy();
    }
    if (this.column) {
      unrx(this, this.column);
    }
    super.ngOnDestroy();
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
