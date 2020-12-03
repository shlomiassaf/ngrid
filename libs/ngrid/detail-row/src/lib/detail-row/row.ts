import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  OnDestroy, Optional,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CdkRow } from '@angular/cdk/table';

import { PblNgridRowComponent, utils, PblNgridComponent, PblRowContext } from '@pebula/ngrid';
import { PblNgridDetailRowPluginDirective, PblDetailsRowToggleEvent, PLUGIN_KEY } from './detail-row-plugin';
import { DetailRowController } from './detail-row-controller';

declare module '@pebula/ngrid/lib/grid/context/types' {
  interface ExternalRowContextState {
    detailRow: boolean;
  }
}

export const PBL_NGRID_ROW_TEMPLATE = '<ng-content select=".pbl-ngrid-row-prefix"></ng-content><ng-container #viewRef></ng-container><ng-content select=".pbl-ngrid-row-suffix"></ng-content>';

@Component({
  selector: 'pbl-ngrid-row[detailRow]',
  exportAs: 'pblNgridDetailRow',
  host: { // tslint:disable-line:no-host-metadata-property
    class: 'pbl-ngrid-row pbl-row-detail-parent',
    role: 'row',
    '[attr.tabindex]': 'grid?.rowFocus',
    '(keydown)': 'handleKeydown($event)'
  },
  template: PBL_NGRID_ROW_TEMPLATE,
  styles: [ `.pbl-row-detail-parent { position: relative; cursor: pointer; }` ],
  providers: [
    { provide: CdkRow, useExisting: PblNgridDetailRowComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridDetailRowComponent extends PblNgridRowComponent implements OnDestroy {

  get expended(): boolean {
    return this.opened;
  }

  get height() {
    return super.height + this.controller.getDetailRowHeight(this);
  }

  // We must explicitly define the inherited properties which have angular annotations
  // Because angular will not detect them when building this library.
  // TODO: When moving up to IVY see if this one get fixed
  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent;
  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  get row() { return this._row; }
  @Input('detailRow') set row(value: any) {
    super.row = value;
    if (this._row !== value) {
      this._row = value;
      this.plugin?.markForCheck();
      this.controller?.detectChanges(this);
    }
  }

  private _row: any;
  private opened = false;
  private plugin: PblNgridDetailRowPluginDirective<any>;
  private controller: DetailRowController;
  private prevRow: PblRowContext<any>;

  constructor(@Optional() grid: PblNgridComponent,
              cdRef: ChangeDetectorRef,
              el: ElementRef<HTMLElement>) {
    super(grid, cdRef, el);
  }

  ngOnDestroy(): void {
    utils.unrx.kill(this);
    this.plugin?.removeDetailRow(this);
    this.controller.clearDetailRow(this, true);
    super.ngOnDestroy();
  }

  updateRow(): void {
    super.updateRow();
    if (this.context) {
      const prevRow = this.prevRow;
      this.prevRow = this.context.$implicit;

      if (this.context.$implicit !== prevRow) { // only if row has changed (TODO: use identity based change detection?)
        switch (this.plugin.whenContextChange) {
          case 'context':
            const isContextOpened = !!this.context.getExternal('detailRow');
            isContextOpened && this.opened
              ? this.controller.updateDetailRow(this) // if already opened, just update the context
              : this.toggle(isContextOpened, true) // if not opened, force to the context state
            ;
            break;
          case 'render':
            if (this.opened) {
              this.controller.updateDetailRow(this);
            }
            break;
          case 'close':
            this.toggle(false, true);
            break;
        }
        this.plugin.toggledRowContextChange.next(this);
      }
    }
  }

  toggle(forceState?: boolean, fromRender = false): void {
    if (this.opened !== forceState) {
      let opened = false;
      if (this.opened) {
        this.controller.clearDetailRow(this, fromRender);
        this.element.classList.remove('pbl-row-detail-opened');
      } else if (this.controller.render(this, fromRender)) {
        opened = true;
        this.element.classList.add('pbl-row-detail-opened');
      }

      if (this.opened !== opened) {
        this.opened = opened;
        this.context.setExternal('detailRow', opened, true);
        this.plugin.detailRowToggled(this);
      }
    }
  }

  /**
   * @internal
   */
  handleKeydown(event: KeyboardEvent): void {
    if ( event.target === this.element ) {
      const keyCode = event.keyCode;
      const isToggleKey = keyCode === ENTER || keyCode === SPACE;
      if ( isToggleKey ) {
        event.preventDefault(); // prevents the page from scrolling down when pressing space
        this.toggle();
      }
    }
  }

  protected init() {
    this.plugin = this._extApi.pluginCtrl.getPlugin(PLUGIN_KEY); // TODO: THROW IF NO PLUGIN...
    this.controller = this.plugin.detailRowCtrl;
    if (this._row) {
      this.plugin.markForCheck();
    }
    super.init();
    this.plugin.addDetailRow(this);
    const tradeEvents = this._extApi.pluginCtrl.getPlugin('targetEvents');
    tradeEvents.cellClick
      .pipe(utils.unrx(this))
      .subscribe( event => {
        if (event.type === 'data' && event.row === this.context.$implicit) {
          const { excludeToggleFrom } = this.plugin;
          if (!excludeToggleFrom || !excludeToggleFrom.some( c => event.column.id === c )) {
            this.toggle();
          }
        }
      });

    tradeEvents.rowClick
      .pipe(utils.unrx(this))
      .subscribe( event => {
        if (!event.root && event.type === 'data' && event.row === this.context.$implicit) {
          this.toggle();
        }
      });
  }
}
