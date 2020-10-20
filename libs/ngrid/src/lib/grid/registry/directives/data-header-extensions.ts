import { Directive, TemplateRef, Injector, Input } from '@angular/core';

import { PblColumn } from '../../column/model';
import { MetaCellContext } from '../../context/index';
import { PblNgridHeaderCellComponent } from '../../cell/header-cell.component'
import { PblNgridRegistryService } from '../registry.service';
import { PblNgridMultiTemplateRegistry } from './multi-template.directives';

export class PblNgridDataHeaderExtensionContext<T = any> extends MetaCellContext<T, PblColumn> {
  readonly injector: Injector

  protected constructor() { super(); }

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static createDateHeaderCtx<T = any>(headerCell: PblNgridHeaderCellComponent<PblColumn>, injector: Injector): PblNgridDataHeaderExtensionContext<T> {
    const instance = new PblNgridDataHeaderExtensionContext<T>();

    instance.col = headerCell.columnDef.column;
    instance.grid = headerCell.grid;
    Object.defineProperty(instance, 'injector', { value: injector });
    return instance;
  }
}

export interface PblNgridDataHeaderExtensionRef<T = any> {
  shouldRender?(context: PblNgridDataHeaderExtensionContext<T>): boolean;
}


/**
 * A generic, multi-purpose template reference for data header extensions.
 * The template's context is `PblNgridDataHeaderExtensionContext`:
 *
 * ```ts
 * interface PblNgridDataHeaderExtensionContext {
 *   col: PblMetaColumn;
 *   grid: PblNgridComponent<any>;
 *   injector: Injector;
 * }
 * ```
 *
 * By default it will render if registered but it is possible to provide a predicate to conditionally load it.
 *
 * ```html
 * <div *pblNgridHeaderExtensionRef="let ctx"></div>
 * ````
 *
 * Or with a `shouldRender` predicate:
 *
 * ```html
 * <div *pblNgridHeaderExtensionRef="shouldRender; let ctx"></div>
 * ```
 *
 * And in the component the template is defined on:
 *
 * ```ts
 * class MyComponent {
 *
 *   shouldRender = (context: PblNgridDataHeaderExtensionContext) => {
 *     // Some code returning true or false
 *   }
 * }
 * ```
 *
 * Note that the `shouldRender` predicate is run once when the header initialize.
 */
@Directive({ selector: '[pblNgridHeaderExtensionRef]' })
export class PblNgridHeaderExtensionRefDirective extends PblNgridMultiTemplateRegistry<PblNgridDataHeaderExtensionContext, 'dataHeaderExtensions'> implements PblNgridDataHeaderExtensionRef {
  private static _id = 0;

  readonly name: string = 'genericHeaderExtension-' + PblNgridHeaderExtensionRefDirective._id++;
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  @Input('pblNgridHeaderExtensionRef') shouldRender?: (context: PblNgridDataHeaderExtensionContext) => boolean;

  constructor(tRef: TemplateRef<PblNgridDataHeaderExtensionContext>, registry: PblNgridRegistryService) { super(tRef, registry); }
}
