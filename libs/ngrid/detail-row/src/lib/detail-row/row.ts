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

import { PblNgridRowComponent, utils, PblNgridComponent } from '@pebula/ngrid';
import { PblNgridDetailRowPluginDirective, PblDetailsRowToggleEvent, PLUGIN_KEY } from './detail-row-plugin';

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

  // We must explicitly define the inherited properties which have angular annotations
  // Because angular will not detect them when building this library.
  // TODO: When moving up to IVY see if this one get fixed
  /**
   * Optional grid instance, required only if the row is declared outside the scope of the grid.
   */
  @Input() grid: PblNgridComponent;
  @ViewChild('viewRef', { read: ViewContainerRef }) _viewRef: ViewContainerRef;

  @Input('detailRow') set row(value: any) { this.updateRow(); }

  private opened = false;
  private plugin: PblNgridDetailRowPluginDirective<any>;
  private prevIdentity: any;

  constructor(@Optional() grid: PblNgridComponent,
              cdRef: ChangeDetectorRef,
              el: ElementRef<HTMLElement>,
              private vcRef: ViewContainerRef) {
    super(grid, cdRef, el);
  }

  ngOnDestroy(): void {
    utils.unrx.kill(this);
    this.plugin?.removeDetailRow(this);
    super.ngOnDestroy();
  }

  updateRow(): void {
    const prevIdentity = this.prevIdentity;
    super.updateRow();
    this.prevIdentity = this.context?.identity;
    if (this.plugin?.whenContextChange === 'context') {
      if (this.context.getExternal('detailRow')) {
        if (this.opened) {
          this.render();
        } else {
          this.toggle(true);
        }
      } else {
        if (this.opened) {
          this.toggle(false);
        }
      }
    } else if (this.opened) {
      if (this.prevIdentity !== prevIdentity && this.prevIdentity) {
        switch (this.plugin.whenContextChange) {
          case 'render':
            this.render();
            break;
          case 'close':
            this.toggle(false);
            break;
        }
        this.plugin.toggledRowContextChange.next(this.createEvent());
      }
    }
  }

  toggle(forceState?: boolean): void {
    if (this.opened !== forceState) {
      if ( this.opened ) {
        this.vcRef.clear();
        this.element.classList.remove('pbl-row-detail-opened');
      } else {
        this.render();
      }
      this.opened = this.vcRef.length > 0;

      if (this.opened) {
        this.element.classList.add('pbl-row-detail-opened');
      }

      this.context.setExternal('detailRow', this.opened, true);
      this.plugin.detailRowToggled(this.createEvent());
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
    super.init();

    this.plugin = this._extApi.pluginCtrl.getPlugin(PLUGIN_KEY); // TODO: THROW IF NO PLUGIN...
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

  private createEvent(): PblDetailsRowToggleEvent<any> {
    const event = Object.create(this);
    Object.defineProperty(event, 'row', { value: this.context.$implicit });
    return event;
  }

  private render(): void {
    this.vcRef.clear();
    if (this.context.$implicit) {
      const detailRowDef = this.context.grid.registry.getSingle('detailRow');
      if ( detailRowDef ) {
        this.vcRef.createEmbeddedView(detailRowDef.tRef, this.context);
      }
    }
  }
}
