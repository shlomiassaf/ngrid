import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  OnDestroy, Optional,
  ViewEncapsulation,
  ViewContainerRef,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CdkRow } from '@angular/cdk/table';

import { PblNgridRowComponent, utils, PBL_NGRID_ROW_TEMPLATE, PblNgridComponent } from '@pebula/ngrid';
import { PblNgridDetailRowPluginDirective, PblDetailsRowToggleEvent, PLUGIN_KEY } from './detail-row-plugin';

@Component({
  selector: 'pbl-ngrid-row[detailRow]',
  exportAs: 'pblNgridDetailRow',
  host: { // tslint:disable-line:use-host-property-decorator
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

  @Input('detailRow') set row(value: any) { this.updateRow(); }

  private get _element(): HTMLElement { return this.el.nativeElement; }
  private opened = false;
  private plugin: PblNgridDetailRowPluginDirective<any>;

  constructor(@Optional() grid: PblNgridComponent,
              el: ElementRef<HTMLElement>,
              private vcRef: ViewContainerRef) {
    super(grid, el);
  }

  ngOnDestroy(): void {
    utils.unrx.kill(this);
    this.plugin.removeDetailRow(this);
    super.ngOnDestroy();
  }

  updateRow(): void {
    const prevIdentity = this.context && this.context.$implicit;
    super.updateRow();
    if (this.opened) {
      const currIdentity = this.context && this.context.$implicit;
      if (currIdentity !== prevIdentity && currIdentity) {
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
        this._element.classList.remove('pbl-row-detail-opened');
      } else {
        this.render();
      }
      this.opened = this.vcRef.length > 0;

      if (this.opened) {
        this._element.classList.add('pbl-row-detail-opened');
      }

      this.plugin.detailRowToggled(this.createEvent());
    }
  }

  /**
   * @internal
   */
  handleKeydown(event: KeyboardEvent): void {
    if ( event.target === this._element ) {
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
