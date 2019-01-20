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

import { NegTableComponent, NegTablePluginController, NegTableRowComponent, NegTableExtensionApi, EXT_API_TOKEN, KillOnDestroy } from '@neg/table';

import { NegTableDetailRowPluginDirective, PLUGIN_KEY } from './detail-row-plugin';

@Component({
  selector: 'neg-table-row[detailRow]',
  exportAs: 'negTableDetailRow',
  host: { // tslint:disable-line:use-host-property-decorator
    class: 'neg-table-row neg-row-detail-parent',
    role: 'row',
    '[attr.tabindex]': 'table?.rowFocus',
    '(keydown)': 'handleKeydown($event)'
  },
  template: CDK_ROW_TEMPLATE,
  styles: [ `.neg-row-detail-parent { position: relative; cursor: pointer; }` ],
  providers: [
    { provide: CdkRow, useExisting: NegTableDetailRowComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
@KillOnDestroy()
export class NegTableDetailRowComponent extends NegTableRowComponent implements OnInit, OnDestroy {

  get expended(): boolean {
    return this.opened;
  }

  @Input('detailRow') get detailRow(): any { return this.context.$implicit; };
  set detailRow(value: any) { this.row = value; };

  table: NegTableComponent<any>;

  private get _element(): HTMLElement { return this.el.nativeElement; }
  private opened = false;
  private plugin: NegTableDetailRowPluginDirective<any>;

  constructor(@Optional() @Inject(EXT_API_TOKEN) extApi: NegTableExtensionApi<any>, el: ElementRef<HTMLElement>, private vcRef: ViewContainerRef) {
    super(extApi, el);
  }

  ngOnInit(): void {
    this.table = this.context.table;
    const controller = NegTablePluginController.find(this.table);
    this.plugin = controller.getPlugin(PLUGIN_KEY); // TODO: THROW IF NO PLUGIN...
    this.plugin.addDetailRow(this);
    const tradeEvents = controller.getPlugin('targetEvents');
    tradeEvents.cellClick
      .pipe(KillOnDestroy(this))
      .subscribe( event => {
        if (event.type === 'data' && event.row === this.detailRow) {
          const { excludeToggleFrom } = this.plugin;
          if (!excludeToggleFrom || !excludeToggleFrom.some( c => event.column.id === c )) {
            this.toggle();
          }
        }
      });

    tradeEvents.rowClick
      .pipe(KillOnDestroy(this))
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
        this._element.classList.remove('neg-row-detail-opened');
      } else {
        this.render();
      }
      this.opened = this.vcRef.length > 0;

      if (this.opened) {
        this._element.classList.add('neg-row-detail-opened');
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
