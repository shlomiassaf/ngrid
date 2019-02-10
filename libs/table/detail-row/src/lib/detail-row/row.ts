import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Inject,
  ElementRef,
  OnInit,
  OnDestroy, Optional,
  ViewEncapsulation,
  ViewContainerRef,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CDK_ROW_TEMPLATE, CdkRow } from '@angular/cdk/table';

import { UnRx } from '@pebula/utils';
import { PblNgridComponent, PblNgridPluginController, PblNgridRowComponent, PblNgridExtensionApi, EXT_API_TOKEN } from '@pebula/table';

import { PblNgridDetailRowPluginDirective, PLUGIN_KEY } from './detail-row-plugin';

@Component({
  selector: 'pbl-ngrid-row[detailRow]',
  exportAs: 'pblNgridDetailRow',
  host: { // tslint:disable-line:use-host-property-decorator
    class: 'pbl-ngrid-row pbl-row-detail-parent',
    role: 'row',
    '[attr.tabindex]': 'table?.rowFocus',
    '(keydown)': 'handleKeydown($event)'
  },
  template: CDK_ROW_TEMPLATE,
  styles: [ `.pbl-row-detail-parent { position: relative; cursor: pointer; }` ],
  providers: [
    { provide: CdkRow, useExisting: PblNgridDetailRowComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
@UnRx()
export class PblNgridDetailRowComponent extends PblNgridRowComponent implements OnInit, OnDestroy {

  get expended(): boolean {
    return this.opened;
  }

  @Input('detailRow') get detailRow(): any { return this.context.$implicit; };
  set detailRow(value: any) { this.row = value; };

  table: PblNgridComponent<any>;

  private get _element(): HTMLElement { return this.el.nativeElement; }
  private opened = false;
  private plugin: PblNgridDetailRowPluginDirective<any>;

  constructor(@Optional() @Inject(EXT_API_TOKEN) extApi: PblNgridExtensionApi<any>, el: ElementRef<HTMLElement>, private vcRef: ViewContainerRef) {
    super(extApi, el);
  }

  ngOnInit(): void {
    this.table = this.context.table;
    const controller = PblNgridPluginController.find(this.table);
    this.plugin = controller.getPlugin(PLUGIN_KEY); // TODO: THROW IF NO PLUGIN...
    this.plugin.addDetailRow(this);
    const tradeEvents = controller.getPlugin('targetEvents');
    tradeEvents.cellClick
      .pipe(UnRx(this))
      .subscribe( event => {
        if (event.type === 'data' && event.row === this.detailRow) {
          const { excludeToggleFrom } = this.plugin;
          if (!excludeToggleFrom || !excludeToggleFrom.some( c => event.column.id === c )) {
            this.toggle();
          }
        }
      });

    tradeEvents.rowClick
      .pipe(UnRx(this))
      .subscribe( event => {
        if (!event.root && event.type === 'data' && event.row === this.detailRow) {
          this.toggle();
        }
      });
  }

  ngOnDestroy(): void {
    this.plugin.removeDetailRow(this);
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
      this.plugin.detailRowToggled(this);
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

  private render(): void {
    this.vcRef.clear();
    if (this.detailRow) {
      const detailRowDef = this.context.table.registry.getSingle('detailRow');
      if ( detailRowDef ) {
        this.vcRef.createEmbeddedView(detailRowDef.tRef, this.context);
      }
    }
  }
}
