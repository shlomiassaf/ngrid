import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CdkRow } from '@angular/cdk/table';

import { unrx } from '@pebula/ngrid/core';
import { PblNgridRowComponent } from '@pebula/ngrid';
import { PblDetailsRowToggleEvent, PLUGIN_KEY } from './tokens';
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
    '[attr.tabindex]': 'grid.rowFocus',
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
export class PblNgridDetailRowComponent extends PblNgridRowComponent implements OnInit, OnDestroy, PblDetailsRowToggleEvent {

  get expended(): boolean {
    return this.opened;
  }

  get height() {
    return super.height + this.controller.getDetailRowHeight(this);
  }

  get row() { return this.context.$implicit; }

  // We must explicitly define the inherited properties which have angular annotations
  // Because angular will not detect them when building this library.
  // TODO: When moving up to IVY see if this one get fixed
  @ViewChild('viewRef', { read: ViewContainerRef, static: true }) _viewRef: ViewContainerRef;

  private opened = false;
  private plugin: import('./detail-row-plugin').PblNgridDetailRowPluginDirective<any>;
  private controller: DetailRowController;

  ngOnInit(): void {
    super.ngOnInit();
    this.plugin.addDetailRow(this);
    const tradeEvents = this._extApi.pluginCtrl.getPlugin('targetEvents');

    tradeEvents.cellClick
      .pipe(unrx(this))
      .subscribe( event => {
        if (event.type === 'data' && event.row === this.context.$implicit) {
          const { excludeToggleFrom } = this.plugin;
          if (!excludeToggleFrom || !excludeToggleFrom.some( c => event.column.id === c )) {
            this.toggle();
          }
        }
      });

    tradeEvents.rowClick
      .pipe(unrx(this))
      .subscribe( event => {
        if (!event.root && event.type === 'data' && event.row === this.context.$implicit) {
          this.toggle();
        }
      });
  }

  ngOnDestroy(): void {
    unrx.kill(this);
    this.plugin.removeDetailRow(this);
    this.controller.clearDetailRow(this, true);
    super.ngOnDestroy();
  }

  updateRow() {
    if (super.updateRow()) { // only if row has changed (TODO: use identity based change detection?)
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
      this.plugin.markForCheck();
      this.controller.detectChanges(this);
      this.plugin.toggledRowContextChange.next(this);
      return true;
    }
    return false;
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

  protected onCtor() {
    super.onCtor();
    this.plugin = this._extApi.pluginCtrl.getPlugin(PLUGIN_KEY); // TODO: THROW IF NO PLUGIN...
    this.controller = this.plugin.detailRowCtrl;
  }
}
