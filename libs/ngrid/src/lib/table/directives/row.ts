import { ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Inject, Input, ViewEncapsulation, SimpleChanges, OnChanges, Optional, DoCheck } from '@angular/core';
import { CdkRow, CDK_ROW_TEMPLATE, RowContext } from '@angular/cdk/table';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/table-ext-api';
import { PblRowContext } from '../context/index';
import { PblNgridComponent } from '../table.component';
import { StylingDiffer, StylingDifferOptions } from './cell-style-class/styling_differ';

export const PBL_NGRID_ROW_TEMPLATE  = `<ng-content select=".pbl-ngrid-row-prefix"></ng-content>${CDK_ROW_TEMPLATE}<ng-content select=".pbl-ngrid-row-suffix"></ng-content>`;

@Component({
  selector: 'pbl-ngrid-row[row]',
  template: PBL_NGRID_ROW_TEMPLATE,
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-ngrid-row',
    'role': 'row',
  },
  providers: [
    { provide: CdkRow, useExisting: PblNgridRowComponent }
  ],
  exportAs: 'pblNgridRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridRowComponent<T = any> extends CdkRow implements OnChanges, DoCheck {

  @Input() set row(value: T) { value && this.updateRow(); }

  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent<T>;

  rowRenderIndex: number;
  context: PblRowContext<T>;

  private _classDiffer: StylingDiffer<{ [klass: string]: boolean }>;
  private _lastClass: Set<string>;

  constructor(@Optional() @Inject(EXT_API_TOKEN) protected extApi: PblNgridExtensionApi<T>, protected el: ElementRef<HTMLElement>) {
    super();
    if (extApi) {
      this.grid = extApi.table;
    }
  }

  updateRow(): void {
    if (this.extApi) {
      if (! (this.rowRenderIndex >= 0) ) {
        this.getRend();
      }
      this.context = this.extApi.contextApi.rowContext(this.rowRenderIndex);
      this.el.nativeElement.setAttribute('row-id', this.context.dataIndex as any);
      this.el.nativeElement.setAttribute('row-key', this.context.identity);

      if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'item') {
        this.updateHostClass();
      }
    }
  }

  ngDoCheck(): void {
    if (this.grid.rowClassUpdate && this.grid.rowClassUpdateFreq === 'ngDoCheck') {
      this.updateHostClass();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.extApi) {
      if (!this.grid) {
        throw new Error('"pbl-ngrid-row" is used outside the scope of a grid, you must provide a grid instance.');
      }
      const controller = PblNgridPluginController.find(this.grid);
      this.extApi = controller.extApi;
      this.updateRow();
    }
  }

  getRend(): void {
    const vcRef = this.extApi.cdkTable._rowOutlet.viewContainer;
    const len = vcRef.length - 1;
    for (let i = len; i > -1; i--) {
      const viewRef = vcRef.get(i) as EmbeddedViewRef<RowContext<T>>;
      if (viewRef.rootNodes[0] === this.el.nativeElement) {
        this.rowRenderIndex = i;
        break;
      }
    }
  }

  protected updateHostClass(): void {
    if (this.context) {
      const el = this.el.nativeElement;

      // if there is an updater, work with it
      // otherwise, clear previous classes that got applied (assumed a live binding change of the updater function)
      // users should be aware to tear down the updater only when they want to stop this feature, if the goal is just to toggle on/off
      // it's better to set the frequency to `none` and return nothing from the function (replace it) so the differ is not nuked.
      if (this.grid.rowClassUpdate) {
        if (!this._classDiffer) {
          this._classDiffer = new StylingDiffer<{ [klass: string]: boolean }>(
            'NgClass',
            StylingDifferOptions.TrimProperties | StylingDifferOptions.AllowSubKeys | StylingDifferOptions.AllowStringValue | StylingDifferOptions.ForceAsMap,
          );
          this._lastClass = new Set<string>();
        }

        const newValue = this.grid.rowClassUpdate(this.context);
        this._classDiffer.setValue(newValue);

        if (this._classDiffer.hasValueChanged()) {
          const lastClass = this._lastClass;
          this._lastClass = new Set<string>();

          const value = this._classDiffer.value || {};

          for (const key of Object.keys(value)) {
            if (value[key]) {
              el.classList.add(key);
              this._lastClass.add(key);
            } else {
              el.classList.remove(key);
            }
            lastClass.delete(key);
          }
          if (lastClass.size > 0) {
            for (const key of lastClass.values()) {
              el.classList.remove(key);
            }
          }
        }
      } else if (this._classDiffer) {
        const value = this._classDiffer.value || {};
        this._classDiffer = this._lastClass = undefined;

        for (const key of Object.keys(value)) {
          el.classList.remove(key);
        }
      }
    }
  }
}
